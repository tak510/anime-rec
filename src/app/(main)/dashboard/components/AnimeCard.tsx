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
      className="bg-[#2f2f31] p-3 rounded-md shadow hover:scale-[1.02] cursor-pointer border-2 border-[#6B4CA0] transition duration-200 flex flex-col" // Add flex and flex-col
    >
      <Image
        src={imageUrl}
        alt={title + id}
        width={200}
        height={300}
        className="w-full h-auto object-cover"
      />
      <div className="p-2 text-white flex-grow">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
      </div>
      {rating !== undefined && (
        <p className="text-sm text-gray-400 p-2 mt-auto">
                  Rating: <span className="text-[#FF5DA2]">{rating}</span>
                  <span className="text-[#FF5DA2]"> / 10</span>
                </p>
      )}
    </div>
  );
}