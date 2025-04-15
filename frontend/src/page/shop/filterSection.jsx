const FilterSection = () => {
  
  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold">Filter By</div>
      <div className="xl:rounded-sm p-2 pb-4 border-2 border-gray-200">
        <div className="font-bold xl:text-xl">Category</div>
        <div className="ms-3 flex flex-col gap-2 mt-2">
          <div>category_name</div>
          <div>category 1</div>
          <div>category 2</div>
        </div>
      </div>
      <div className="xl:rounded-sm p-2 pb-4 border-2 border-gray-200">
        <div className="font-bold xl:text-xl">Author</div>
        <div className="ms-3 flex flex-col gap-2 mt-2">
          <div>author_name</div>
          <div>author 1</div>
          <div>author 2</div>
        </div>
      </div>
      <div className="xl:rounded-sm p-2 pb-4 border-2 border-gray-200">
        <div className="font-bold xl:text-xl">Rating Review</div>
        <div className="ms-3 flex flex-col gap-2 mt-2">
          <div>1 Star</div>
          <div>2 Star</div>
          <div>3 Star</div>
          <div>4 Star</div>
          <div>5 Star</div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
