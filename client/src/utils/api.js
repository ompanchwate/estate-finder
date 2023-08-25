import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/getallresidencies", {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    // toast.success("Data Fetched")
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    // toast.success("Data Fetched")
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
}

export const createUser = async (email, token) => {
  try {
    await api.post('/user/register', { email: email }, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
}


export const bookVisit = async(date, propertyId, email, token) => {
  try {
    console.log(token)
    console.log(email)
    console.log(date)
    console.log(propertyId)
    await api.post(
      `user/bookVisit/${propertyId}`,
      { // Payloads/ Parameters
        email: email,
        id:propertyId,
        date:dayjs(date).format("DD/MM/YYYY")
      },
      {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }
    )
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
}


export const removeBooking = async(id, email, token) =>{
  try {
    await api.post(
      `/user/removeBooking/${id}`,
      {
        email: email
      },
      {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      }
    )

    toast.success("Booking Cancelled Successfully", {position:"bottom-right"});
  } catch (error) {
      toast.error("Something went wrong, Please try again", {position: "bottom-right"})
      throw error
  }
}


export const toFav = async(id, email, token)=> {
  try{
    await api.post(
      `/user/toFav/${id}`,
      {
        email: email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

  }catch(error){
    throw error
  }

}


export const getAllFav = async (email, token) => {
  if(!token) return 
  try{

    const res = await api.post(
      `/user/allFav`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      
    return res.data["favResidenciesID"]

  }catch(e)
  {
    toast.error("Something went wrong while fetching favs");
    throw e
  }
} 


export const getAllBookings = async (email, token) => {
  if(!token) return 
  try{

    const res = await api.post(
      `/user/getBookings`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data["bookedVisits"])
    return res.data["bookedVisits"]
  }catch(error){
    toast.error("Something went wrong while fetching booking");
    throw error;
  }
} 

export const createResidency = async (data, token) => {
  console.log(data)
  console.log(token)
  try{
    const res = await api.post(
      `/residency/create`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }catch(error)
  {
    console.log(error)
    throw error
  }
}
