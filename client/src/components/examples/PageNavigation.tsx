import PageNavigation from '../PageNavigation';

export default function PageNavigationExample() {
  return (
    <div className="bg-[hsl(30_3%_8%)] p-8 flex justify-center">
      <PageNavigation 
        currentPage={15}
        totalPages={62}
        onPrevious={() => console.log('Previous')}
        onNext={() => console.log('Next')}
        onFirst={() => console.log('First')}
        onLast={() => console.log('Last')}
      />
    </div>
  );
}
