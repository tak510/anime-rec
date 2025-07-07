import Image from 'next/image'

type AnimeCardProps = {
  id: string
  title: string
  imageUrl: string
  rating?: number
  onClick?: () => void
}

export default function AnimeCard({ id, title, imageUrl, rating, onClick }: AnimeCardProps) {
  return (
    <div
      onClick={onClick} 
      className="bg-[#2f2f31] p-3 rounded-md shadow hover:scale-[1.02] cursor-pointer transition duration-200">
      <Image
        src={imageUrl}
        alt={title+id}
        width={200}
        height={300}
        className="w-full h-auto object-cover"
      />
      <div className="p-2 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        {rating !== undefined && (
          <p className="text-xs text-[#FF5DA2]">Your Rating: {rating}/10</p>
        )}
      </div>
    </div>
  )
}