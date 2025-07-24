'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Anime } from '@/lib/types'
import {
  addOrUpdateAnimeEntry,
  removeAnimeEntry,
  getUserAnimeEntryStatus,
  AnimeEntryStatus,
  supabase
} from '@/lib/supabase'

type Props = {
  anime: Anime
  onClose: () => void
  onListUpdate?: () => void;
}

export default function AnimeModal({ anime, onClose, onListUpdate }: Props) {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<AnimeEntryStatus | null>(null);
  const [loadingAction, setLoadingAction] = useState<AnimeEntryStatus | 'remove' | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Check user login status and anime's current list status on modal open
  useEffect(() => {
    async function checkStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      setUserLoggedIn(!!session);

      if (session) {
        const status = await getUserAnimeEntryStatus(anime.id);
        setCurrentStatus(status);
      }
    }
    checkStatus();
  }, [anime.id]);

  const handleAddToList = async (status: AnimeEntryStatus) => {
    if (!userLoggedIn) {
      setActionMessage('Please log in to add anime to your lists.');
      return;
    }

    setLoadingAction(status);
    setActionMessage(null);
    try {
      await addOrUpdateAnimeEntry(anime.id, status);
      setCurrentStatus(status);
      setActionMessage(`Added to ${status === 'plan' ? 'Watchlist' : status.charAt(0).toUpperCase() + status.slice(1)}!`);
      if (onListUpdate) {
        onListUpdate();
      }
    } catch (error: unknown) {
      setActionMessage(`Error: ${error}`);
      console.error("Failed to add anime to list:", error);
    } finally {
      setLoadingAction(null);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleRemoveFromList = async () => {
    if (!userLoggedIn) {
      setActionMessage('Please log in to remove anime from your lists.');
      return;
    }

    setLoadingAction('remove');
    setActionMessage(null);
    try {
      await removeAnimeEntry(anime.id);
      setCurrentStatus(null);
      setActionMessage('Removed from list!');
      if (onListUpdate) {
        onListUpdate();
      }
    } catch (error: unknown) {
      setActionMessage(`Error: ${error}`);
      console.error("Failed to remove anime from list:", error);
    } finally {
      setLoadingAction(null);
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  // Helper function to render action buttons dynamically
  const renderActionButton = (targetStatus: AnimeEntryStatus, buttonLabel: string) => {
    const isCurrent = currentStatus === targetStatus;
    const isLoading = loadingAction === targetStatus;
    const isDisabled = isLoading || !userLoggedIn;

    return (
      <button
        key={targetStatus}
        onClick={() => handleAddToList(targetStatus)}
        disabled={isDisabled}
        className={`
          flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200
          ${isCurrent
            ? 'bg-[#FF5DA2] text-white cursor-default opacity-80'
            : 'bg-[#2FFFE2] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-[#2FFFE2] border border-[#2FFFE2]'
          }
          ${!userLoggedIn ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-70' : ''}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? 'Processing...' :
         isCurrent ? `In ${buttonLabel}` : `Add to ${buttonLabel}`}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-[#1D1D1F] text-white max-w-3xl w-full rounded-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-4 p-6">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.userPreferred}
            width={200}
            height={300}
            className="rounded-md object-cover"
          />

          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-[#FF5DA2]">
              {anime.title.userPreferred}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-[12] overflow-y-auto max-h-[300px]">
              {anime.description?.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '')}
            </p>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-[#252527] text-[#2FFFE2] text-xs px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Action Buttons for Lists */}
            <div className="mt-6 border-t border-gray-700 pt-4 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-[#2FFFE2] mb-3">Manage Your List:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-md">
                {renderActionButton('watching', 'Watching')}
                {renderActionButton('completed', 'Watched')}
                {renderActionButton('plan', 'Watchlist')}
              </div>

              {currentStatus && userLoggedIn && ( // No check for loadingAction here anymore
                <button
                  onClick={handleRemoveFromList}
                  disabled={loadingAction === 'remove'}
                  className="mt-4 px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAction === 'remove' ? 'Removing...' : 'Remove from List'}
                </button>
              )}

              {/* Action Message Display */}
              {actionMessage && (
                <p className={`text-center text-sm mt-3 px-4 py-2 rounded-md ${actionMessage.startsWith('Error') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                  {actionMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}