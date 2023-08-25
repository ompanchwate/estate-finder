import React, { useContext, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { getProperty, removeBooking } from '../../utils/api'
import { PuffLoader } from 'react-spinners'
import { AiFillHeart, AiTwotoneCar } from 'react-icons/ai'
import { FaShower } from 'react-icons/fa'
import { MdMeetingRoom, MdLocationPin } from 'react-icons/md'
import './Property.css'
import { useAuth0 } from "@auth0/auth0-react";
import useAuthCheck from "../../hooks/useAuthCheck"
import BookingModal from '../../components/BookingModal/BookingModal'
import UserDetailContext from '../../context/UserDetailContext'
import { Button } from '@mantine/core'
import Heart from '../../components/Heart/heart'
import Map from '../../components/Map/Map'

const Property = () => {
  // pathname : /properties/6460802e05fa5b3fd0527f65   
  const { pathname } = useLocation()  // Getting the URL
  const id = pathname.split('/').slice(-1)[0]   //  Getting the ID of the property

  const { data, isLoading, isError } = useQuery(["residency", id], () => getProperty(id))

  const [modalOpened, setModalOpened] = useState(false);   // Booking modal
  const { validateLogin } = useAuthCheck();   // User defined Hook for Authentication
  const { user } = useAuth0();   // Get the details of the user

  const { userDetails: { token, booking }, setUserDetails } = useContext(UserDetailContext)
  // console.log(token)

  const { mutate: cancelBooking, isLoading: cancelling } = useMutation({
    mutationFn: () => removeBooking(id, user?.email, token),
    onSuccess: () => {
      setUserDetails((prev) => ({
        ...prev,
        booking: prev.booking.filter((booking) => booking?.id !== id)
      }))

      toast.success("Booking Cancelled", { position: 'bottom-right' })
    }
  });



  if (isLoading) {
    return (
      <div className="wrapper">
        <div className="flexCenter paddings">
          <PuffLoader />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="wrapper">
        <div className="flexColStart paddings">
          <span>Error while fetching the details</span>
        </div>
      </div>
    )
  }

  return (
    <div className='wrapper'>
      <div className="flexColStart paddings innerWidth property-container">
        {/* Like Button  */}
        <div className="like">
          <Heart id={id}/>
        </div>

        {/* image  data?  : prevent the application from direct crashing  */}
        <img src={data?.image} alt="home image" />

        <div className='flexCenter property-details'>

          {/* left  */}
          <div className="flexColStart left">
            <div className="flexStart head">
              <span className='primaryText'>{data?.title}</span>
              <span className='orangeText' style={{ fontSize: '1.5rem' }}>$ {data?.price}</span>
            </div>

            {/* Facilities */}
            <div className="flexStart facilities">
              {/* Bathrooms  */}
              <div className="flexStart facility">
                <FaShower size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Bathrooms</span>
              </div>

              {/* parkings */}
              <div className="flexStart facility">
                <AiTwotoneCar size={20} color="#1F3E72" />
                <span>{data?.facilities?.parkings} Parking</span>
              </div>

              {/* rooms  */}
              <div className="flexStart facility">
                <MdMeetingRoom size={20} color="#1F3E72" />
                <span>{data?.facilities?.bathrooms} Room</span>
              </div>
              <div className="flexStart facility"></div>
              <div className="flexStart facility"></div>
            </div>


            {/* description */}
            <span className='secondaryText' style={{ textAlign: "justify" }}>
              {data?.description}
            </span>


            {/* address */}
            <div className="flexStart" style={{ gap: "1rem" }}>
              <MdLocationPin size={25} />
              <span className='secondaryText'>
                {
                  data?.address
                },
                {data?.city},
                {data?.country}
              </span>
            </div>

            {/* Booking Button */}
            {booking?.map((booking) => booking.id).includes(id) ? (
              <>
                <Button variant="outline" w={"100%"} color="red" onClick={()=> cancelBooking()} disabled={cancelling}>
                  Cancel Booking
                </Button>
                <span>
                  Your visit already booked for date {booking?.filter((booking) => booking?.id === id)[0].date}
                </span>

              </>
            ) : (
              <button className="button"
                onClick={() => {
                  validateLogin() && setModalOpened(true);  // In JS if the first condition is true then the 2nd is executed
                }}>
                Book your visit
              </button>
            )

            }


            <BookingModal
              opened={modalOpened}
              setModalOpened={setModalOpened}
              propertyId={id}
              email={user?.email}
            />
          </div>

          {/* right side */}
          {/* displays the MAP */}
          <div className="map">
            <Map
              address={data?.address}
              city={data?.city}
              country={data?.country}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Property