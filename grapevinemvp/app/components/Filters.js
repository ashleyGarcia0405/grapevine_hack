import React, { useState } from 'react';

const Filters = ({ onChange }) => {
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onChange({ category: e.target.value, sortBy });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    onChange({ category, sortBy: e.target.value });
  };
}

//   return (
//   //   // <div className="flex flex-wrap items-center justify-between mb-6">
//   //   //   <div>
//   //   //     <label htmlFor="sortBy" className="mr-2">Sort by:</label>
//   //   //     <select
//   //   //       id="sortBy"
//   //   //       value={sortBy}
//   //   //       onChange={handleSortChange}
//   //   //       className="px-2 py-1 border rounded"
//   //   //     >
//   //   //       <option value="recent">Most Recent</option>
//   //   //       <option value="popular">Most Popular</option>
//   //   //       <option value="trending">Trending</option>
//   //   //     </select>
//   //   //   </div>
//   //   // </div>
    
//   // );
// };

export default Filters;