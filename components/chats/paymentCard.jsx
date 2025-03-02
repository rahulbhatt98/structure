import React, { useState } from 'react';

const PaymentSummaryCard = () => {
    const [insurance, setInsurance] = useState(true);
    const subtotal = 25;
    const serviceCharge = 1.5;
    const insuranceFee = insurance ? 2 : 0;
    const total = subtotal + serviceCharge + insuranceFee;

    return (
        <div className="bg-white p-6 rounded-xl policyShadow max-w-md lg:mx-auto mb-2">
            {/* Insurance Checkbox */}
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    checked={insurance}
                    onChange={() => setInsurance(!insurance)}
                    className="form-checkbox h-5 w-5 text-green-600 rounded"
                />
                <label className="ml-2 text-gray-800 font-semibold">Add Insurance</label>
            </div>
            <p className="text-sm text-gray-500 ml-7">
                Add $2 for added protection; <a href="" className="mainbluetext">terms & conditions</a> apply.
            </p>

            {/* Divider */}
            <hr className="my-4" />

            {/* Summary Details */}
            <div className="text-gray-600">
                <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Service Charge</span>
                    <span>${serviceCharge.toFixed(2)}</span>
                </div>
                {insurance && (
                    <div className="flex justify-between mb-2">
                        <span>Insurance</span>
                        <span>${insuranceFee.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold text-gray-800 mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>

            {/* Confirm Button */}
            <button className="bg-[#0FC281] greenShadow text-white w-full px-6 py-2 mt-3 md:mt-0 rounded-md font-semibold">
                Confirm Payment & Make Offer
            </button>
        </div>
    );
};

export default PaymentSummaryCard;
