// import React from 'react'

// function AddTime({ isOpen, onClose }) {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white relative rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg">
//                 <button
//                     type='button'
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                 >
//                     &#x2715;
//                 </button>
//                 <h2 className="text-2xl font-semibold text-gray-800">Add Time</h2>
//                 <p className="text-gray-600 mt-2">Please add time duration to calculate amount</p>
//                 <div className="mt-4">
//                     <label for="time" className="text-gray-700">Time</label>
//                     <div className=" flex  w-full text-xs font-medium p-2 rounded-lg blueBordermain placeholder:text-gray-500 shadow-sm outline-none sm:text-sm"
//                     >
//                         <input type="number" id="time" name="time" className="w-full outline-none" placeholder="01" />
//                         <span className=" text-gray-500">/hr</span>
//                     </div>
//                 </div>
//                 <p className="mt-4 text-gray-800">Total Amount: <span className="text-blue-600">$25</span></p>
//                 <div className="mt-6">
//                     <button className="w-full mainblue text-white font-semibold py-2 rounded-lg">Add</button>
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default AddTime;
import React, { useState } from 'react';

function AddTime({ isOpen, onClose, onSave, servicePrice }) {
    const [enteredHours, setEnteredHours] = useState(null); // Track entered hours

    const handleWheel = (e) => {
        e.target.blur(); // Removes focus from the input
        e.preventDefault(); // Prevents the default scroll behavior
    };
    const blockInvalidChar = (e) => {
        // Allow backspace
        if (e.key === "Backspace") {
          return;
        }
        // Block alphabets and specific characters
        if (!/^\d$/.test(e.key) || ["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
        }
      };
    const totalAmount = servicePrice * enteredHours; // Calculate total amount
    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white relative rounded-lg shadow-lg p-6 w-full max-w-md sm:max-w-lg">
                <button
                    type='button'
                    onClick={() => onClose(false)} // Close without saving
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    &#x2715;
                </button>
                <h2 className="text-2xl font-semibold text-gray-800">Add Time</h2>
                <p className="text-gray-600 mt-2">Please add time duration to calculate the amount</p>
                <div className="mt-4">
                    <label htmlFor="time" className="text-gray-700">Time (in hours)</label>
                    <div class="w-full flex requestborder outline-none rounded-md p-2 focus:outline-none">
                        <input
                            type="number"
                            id="time"
                            name="time"
                            onWheel={handleWheel}
                            onKeyDown={blockInvalidChar}
                            className="w-full border-none focus:outline-none"
                            placeholder="01"
                            
                            value={enteredHours}
                            onChange={(e) => setEnteredHours(Number(e.target.value))} // Update hours as user inputs
                        />
                        <span className=" text-gray-500">/hr</span>
                    </div>
                </div>
                <p className="mt-4 text-gray-800">Total Amount: <span className="text-blue-600">${totalAmount}</span></p>
                <div className="mt-6">
                    <button
                        className="w-full mainblue text-white font-semibold py-2 rounded-lg"
                        onClick={() => onSave(enteredHours)} // Save the entered hours
                    >
                        Add Time
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTime;

