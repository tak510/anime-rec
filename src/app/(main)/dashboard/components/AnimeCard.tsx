import Image from 'next/image'

type AnimeCardProps = {
  id: string
  title: string
  imageUrl: string
  rating?: number
}

export default function AnimeCard({ id, title, imageUrl, rating }: AnimeCardProps) {
  return (
    <div className="bg-[#2f2f31] rounded overflow-hidden shadow-md hover:shadow-lg transition border border-[#2FFFE2]">
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