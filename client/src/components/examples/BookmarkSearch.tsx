import BookmarkSearch from '../BookmarkSearch';

export default function BookmarkSearchExample() {
  return (
    <div className="bg-[hsl(30_3%_8%)] p-8 flex justify-center">
      <BookmarkSearch 
        onSpellSelect={(spell) => console.log('Selected spell:', spell.name)} 
      />
    </div>
  );
}
