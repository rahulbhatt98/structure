import { useState } from "react";
import MakeOffer from "../modals/makeOffer";
import Cookies from "js-cookie";
import ViewOffer from "../modals/viewOffer";

const RequestInfo = ({ request, price, service, serviceType, location, dateTime }) => {
  const roleSelected = Cookies.get("roleSelected");

  const [isModalOpen, setisModalOpen] = useState(false);
  const closeModal = () => setisModalOpen(false);
  const openModal = () => {
    setisModalOpen(true);
  };


  const [isViewModalOpen, setisViewModalOpen] = useState(false);
  const closeViewModal = () => setisViewModalOpen(false);
  const openViewModal = () => {
    setisViewModalOpen(true);
  };

  return (
    <div className="bg-white p-4 policyShadow rounded-md m-2 mx-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900">
          <span className="font-medium text-gray-600 text-xs block">Request for:</span>
          {request}
        </h4>
        <span className="text-2xl mainbluetext font-semibold">{`$${price}`}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2  text-sm">
        <div>
          <span className="font-medium text-gray-600 text-xs block">Service:</span> {service}
        </div>
        <div>
          <span className="font-medium  text-gray-600 text-xs block">Service Type:</span> {serviceType}
        </div>
        <div>
          <span className="font-medium text-gray-600 text-xs block">Location:</span> {location}
        </div>
        <div>
          <span className="font-medium text-gray-600 text-xs block">Date & Time:</span> {dateTime}
        </div>
        <div className="md:justify-end flex">
          <button
            onClick={roleSelected === "customer" ? openModal : openViewModal}
            type="button"
            className="px-3 font-semibold py-3 mainblue text-white rounded-lg"
          >
            {roleSelected === "customer" ? "Make Offer" : "View Offer"}
          </button>
        </div>
        {isModalOpen && (
          <MakeOffer
            isOpen={isModalOpen}
            onClose={() => closeModal()}
          />
        )}
        {isViewModalOpen && (
          <ViewOffer
            isOpen={isViewModalOpen}
            onClose={() => closeViewModal()}
          />
        )}
      </div>
    </div>
  );
};

export default RequestInfo;
