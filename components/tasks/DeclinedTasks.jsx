import React, { useEffect, useState } from 'react'
import IncomingTasks from './IncomingTasks'
import BasicPagination from '../common/basicPagination'
import RotatingLoaderWithImage from '../common/RotateLoader'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { getTaskListAsync } from '../../redux/auth/authSlice'

const DeclinedTasks = ({sortDate, price, radius }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [declinedData, setDeclinedData] = useState([])
    const [declinedLoading, setDeclinedLoading] = useState(false)
    const [expendableId, setExpendableId] = useState("")
    const [Total, setTotal] = useState(null);
    const [page, setPage] = useState(1);
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const dispatch = useDispatch()
    const toggleExpand = (label, id) => {
        setIsExpanded(label === "open" ? true : false);
        setExpendableId(label === "open" ? id : "")
    };

    const getDeclinedTask = () => {
        let params = {
            "page": page,
            "limit": 10,
            "status": "declined",
            "date": sortDate
        }
        if(price[1] !== 0){
            params = {
                ...params,
                startPrice: price[0],
                endPrice: price[1]
            }
        }
        if(radius != "0"){
            params = {
                ...params,
                radius: radius
            }
        }
        setDeclinedLoading(true)
        dispatch(getTaskListAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                setDeclinedLoading(false)
                setDeclinedData(obj?.data?.data?.data)
                setTotal(obj?.data?.data?.totalRecords);
                console.log(obj?.data?.data?.data, obj, "declined responseeeeeeeeeee");
            })
            .catch((obj) => {
                setDeclinedLoading(false)
            });
    }

    useEffect(() => {
        getDeclinedTask()
    }, [page])
    return (
        <>
            {declinedLoading ? <RotatingLoaderWithImage /> :
                declinedData?.length > 0 ?
                    <>
                        {
                            declinedData?.map((val, index) => {
                                return (
                                    <IncomingTasks expendableId={expendableId} declined={true} key={index} isExpanded={isExpanded} toggleExpand={toggleExpand} data={val} />
                                )
                            })
                        }
                        <div className="my-4 flex justify-center items-center">
                            <BasicPagination
                                count={Math.ceil(Total / 10)}
                                page={page}
                                onChange={handlePageChange}
                            />
                        </div>
                    </>
                    : <div className='h-[50vh] w-full flex justify-center items-center'>
                        <div className='font-bold md:text-lg'>No Declined Request Found</div>
                    </div>
            }
        </>
    )
}

export default DeclinedTasks