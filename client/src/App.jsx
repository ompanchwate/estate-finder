import { Suspense, useState } from "react";
import "./App.css";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import React from "react";

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import Bookings from "./pages/Bookings/Bookings";
import Favourites from "./pages/Favourites/Favourites";
import Properties from "./pages/Properties/Properties";

function App() {
  const queryClient = new QueryClient();
  const [userDetails, setUserDetails] = useState({
    favourites: [],
    booking: [],
    tokens: null,
  })

  /* React Query is a powerful library for managing remote and asynchronous data in React 
  applications. It simplifies data fetching, caching, synchronization, and state management 
  related to network requests.  */


 /* UserDetailContext.Provider: You're wrapping your entire app with the UserDetailContext.Provider,
  which provides the userDetails state and the setUserDetails function to its child components. 
  This allows any component nested within this provider to access and update the user details 
  without needing to pass them down through multiple layers.
*/
  return (
    // userDetails is passed to any component directly without passing it sequentially from one component to another
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>   {/* User Details */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Website />} />
                <Route path="/properties">
                  <Route index element={<Properties />} />   {/* index : default path */}
                  <Route path=":propertyId" element={<Property />} />
                </Route>
                <Route path="/bookings" element={<Bookings/>}></Route>
                <Route path="/favourites" element={<Favourites/>}></Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserDetailContext.Provider>
  );
}

export default App;
