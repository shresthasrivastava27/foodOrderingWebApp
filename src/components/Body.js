// import RestaurantCard from "./RestaurantCard";
// import { RESTAURANT_URL } from "../utils/constants";
// import { useEffect, useState } from "react";
// import Shimmer from "./Shimmer";



// // Whenever state variable updates, React re-renders the component or triggers reconcillation cycle.
// const Body = () => {
//   const [allRestaurants, setAllRestaurants] = useState([]);
//   const [filteredResturant, setFilteredResturant] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   console.log({ searchText });
//   function getResFilter() {
//     setAllRestaurants(
//       allRestaurants.filter((item) => {
//         return item.data.avgRating > 4;
//       })
//     );
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const data = await fetch(`${RESTAURANT_URL}`);
//     const json = await data.json();
//     console.log("API RESPONSE", json);

//     async function checkJsonData(jsonData) {
//       for (let i = 0; i < jsonData?.data?.cards.length; i++) {
//         // initialize checkData for Swiggy Restaurant data
//         let checkData =
//           json?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle
//             ?.restaurants;

//         // if checkData is not undefined then return it
//         if (checkData !== undefined) {
//           return checkData;
//         }
//       }
//     }

//     const resData = await checkJsonData(json);
//     setAllRestaurants(resData);
//     setFilteredResturant(resData);
//   };

//   return allRestaurants.length === 0 ? (
//     <Shimmer />
//   ) : (
//     <>
//       <div className="body">
//         <div className="filter">
//           <div className="search-container">
//             <input
//               type="text"
//               className="search-input"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search a restaurant you want..."
//             />
//             <button
//               className="search-btn"
//               onClick={() => {
//                 let filteredResturant = allRestaurants.filter((res) => {
//                   return res?.info?.name
//                     .toLowerCase()
//                     .includes(searchText.toLowerCase());
//                 });
//                 setFilteredResturant(filteredResturant);
//               }}
//             >
//               Search
//             </button>
//           </div>
//           {/* <button className="filter-btn" onClick={getResFilter}>Top Rated Restaurants</button> */}
//         </div>
//         <div className="res-container">
//           {filteredResturant.map((restaurant) => {
//             return (
//               <RestaurantCard
//                 key={restaurant?.info?.id}
//                 {...restaurant?.info}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Body;





import RestaurantCard from "./RestaurantCard";
import { RESTAURANT_URL } from "../utils/constants";
import { useEffect, useState, useCallback } from "react";
import Shimmer from "./Shimmer";

const Body = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Memoized search function
  const performSearch = useCallback(() => {
    const filtered = allRestaurants.filter((res) => 
      res?.info?.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRestaurant(filtered);
  }, [allRestaurants, searchText]);

  // Debounced search
  const debouncedSearch = debounce(performSearch, 500);

  useEffect(() => {
    debouncedSearch();
    return () => clearTimeout(debouncedSearch);
  }, [searchText, debouncedSearch]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(`${RESTAURANT_URL}`);
    const json = await data.json();

    async function checkJsonData(jsonData) {
      for (let i = 0; i < jsonData?.data?.cards.length; i++) {
        let checkData = json?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
        if (checkData !== undefined) return checkData;
      }
    }

    const resData = await checkJsonData(json);
    setAllRestaurants(resData);
    setFilteredRestaurant(resData);
  };

  return allRestaurants.length === 0 ? (
    <Shimmer />
  ) : (
    <div className="body">
      <div className="filter">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search a restaurant you want..."
          />
          <button
            className="search-btn"
            onClick={performSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="res-container">
        {filteredRestaurant.map((restaurant) => (
          <RestaurantCard
            key={restaurant?.info?.id}
            {...restaurant?.info}
          />
        ))}
      </div>
    </div>
  );
};

export default Body;