import BookCover from '../BookCover';

export default function BookCoverExample() {
  return (
    <div className="flex gap-4">
      <div 
        className="w-[380px] h-[520px] rounded-r-lg overflow-hidden"
        style={{ boxShadow: '4px 4px 20px rgba(0,0,0,0.4)' }}
      >
        <BookCover type="front" />
      </div>
      <div 
        className="w-[380px] h-[520px] rounded-l-lg overflow-hidden"
        style={{ boxShadow: '4px 4px 20px rgba(0,0,0,0.4)' }}
      >
        <BookCover type="back" />
      </div>
    </div>
  );
}
