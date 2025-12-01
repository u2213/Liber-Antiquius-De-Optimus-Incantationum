import TableOfContents from '../TableOfContents';

export default function TableOfContentsExample() {
  const mockPageMap: Record<string, number> = {
    Blood: 3,
    Eldritch: 8,
    Ender: 12,
    Evocation: 20,
    Fire: 28,
    Holy: 36,
    Ice: 44,
    Lightning: 50,
    Nature: 56,
  };

  return (
    <div 
      className="w-[380px] h-[520px] rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(39 35% 88%), hsl(35 25% 80%))',
        boxShadow: '4px 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <TableOfContents 
        onSchoolSelect={(name, page) => console.log(`Go to ${name} at page ${page}`)}
        schoolPageMap={mockPageMap}
      />
    </div>
  );
}
