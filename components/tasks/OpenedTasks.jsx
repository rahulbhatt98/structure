import React, { useEffect, useState } from 'react'
import BasicPagination from '../common/basicPagination'
import RotatingLoaderWithImage from '../common/RotateLoader'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { getOpenTaskListAsync } from '../../redux/auth/authSlice'
import OpenedTaskList from './OpenedTaskList'
import ProfessionalMap from '../Home/ProfessionalMap'
const OpenedTasks = ({ taskView, headerSearch, setTaskView, sortDate, price, radius}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [openedData, setOpenedData] = useState([])
    const [loading, setLoading] = useState(false)
    const [Total, setTotal] = useState(null);
    const [page, setPage] = useState(1);
    const [expendableId, setExpendableId] = useState("")
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const dispatch = useDispatch()
    const toggleExpand = (label, id) => {
        setIsExpanded(label === "open" ? true : false);
        setExpendableId(label === "open" ? id : "")
    };


    const getOpenedTask = () => {
        let params = {
            "page": page,
            "limit": 10,
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
        setLoading(true)
        dispatch(getOpenTaskListAsync(params))
            .then(unwrapResult)
            .then((obj) => {
                setLoading(false)
                setOpenedData(obj?.data?.data?.data)
                setTotal(obj?.data?.data?.totalRecords);
                console.log(obj?.data?.data?.data, obj, "openeddddddddd responseeeeeeeeeee");
            })
            .catch((obj) => {
                setLoading(false)
            });
    }

    useEffect(() => {
        getOpenedTask()
    }, [page])
    return (
        <>
            {loading ? <RotatingLoaderWithImage /> :
             taskView === "list" ?
                openedData?.length > 0 ?
                    <>
                        {
                            openedData?.map((val, index) => {
                                return (
                                    <OpenedTaskList expendableId={expendableId} opened={true} key={index} isExpanded={isExpanded} toggleExpand={toggleExpand} data={val} />
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
                        <div className='font-bold md:text-lg'>No Open Tasks Found</div>
                    </div>
        :<ProfessionalMap headerSearch={headerSearch} taskData={openedData} setTaskView={setTaskView} setExpendableId={setExpendableId} setIsExpanded={setIsExpanded} />   
        }
        </>
    )
}

export default OpenedTasks