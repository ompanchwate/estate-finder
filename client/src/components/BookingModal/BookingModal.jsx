import React, { useContext, useState } from 'react'
import { Modal, Button } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useMutation } from 'react-query'
import UserDetailContext from '../../context/UserDetailContext'
import { bookVisit } from '../../utils/api'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

const BookingModal = ({ opened, setModalOpened, email, propertyId }) => {
    const [value, setValue] = useState(null)
    const { userDetails: { token }, setUserDetails } = useContext(UserDetailContext)  // 1

    const handleBookingSuccess = () => {
        toast.success("You have booked your visit", { position: "bottom-right" })
        setUserDetails((prev) => ({
            ...prev,
            booking: [
                ...prev.booking,
                {
                    id: propertyId, date: dayjs(value).format("DD/MM/YYYY")
                }
            ]
        }))
    };

    // useMutation is a part of Reaact Query
    const { mutate, isLoading } = useMutation({
        mutationFn: () => bookVisit(value, propertyId, email, token), // API function
        onSuccess: () => handleBookingSuccess(),
        onError: ({ response }) => toast.error(response.data.message),
        onSettled: () => setModalOpened(false)
    })

    // Use mutate() when we have to change the data in the database,useQuery is 

    return (
        <Modal
            opened={opened}
            onClose={() => setModalOpened(false)}
            title="Select your date of visit"
            centered>

            <div className='flexColCenter'>
                <DatePicker value={value} onChange={setValue} minDate={new Date()} />
                <Button disabled={!value} onClick={() => mutate()}>
                    Book Visit
                </Button>
            </div>
        </Modal>
    )
}

export default BookingModal



//1. The code snippet you provided is using object destructuring along with the useContext hook to extract the token property from the userDetails object obtained from the UserDetailContext


// Mutation:  A mutation, in the context of GraphQL, refers to an operation that modifies data on the server. In GraphQL,
//you can define mutations in your schema to specify how data can be changed on the server, and clients can send
//mutation queries to execute those changes. Mutations often correspond to actions like creating, updating, or deleting data.


// Mutate: The term "mutate" generally refers to making changes to data, often through API requests, that result in some modification
// of the data on the server. In the context of libraries like React Query, "mutate" is a function provided by the library that
// allows you to trigger changes to data and handle the corresponding API calls for actions like creating, updating, or deleting
// resources on the server.
