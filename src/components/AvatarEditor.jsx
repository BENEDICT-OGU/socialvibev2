import React, { useState, useRef } from "react";
import { FiCamera, FiRotateCw, FiZoomIn, FiZoomOut, FiCheck, FiX } from "react-icons/fi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const AvatarEditor = ({ currentAvatar, onSave, onCancel }) => {
  const [image, setImage] = useState(currentAvatar);
  const [cropper, setCropper] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const getCropData = () => {
    if (cropper) {
      onSave(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const zoom = (amount) => {
    if (cropper) {
      cropper.zoom(amount);
    }
  };

  const rotate = (degrees) => {
    if (cropper) {
      cropper.rotate(degrees);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          <Cropper
            src={image}
            aspectRatio={1}
            guides={false}
            cropBoxResizable={false}
            viewMode={1}
            minCropBoxWidth={100}
            minCropBoxHeight={100}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => zoom(0.1)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Zoom In"
        >
          <FiZoomIn />
        </button>
        <button
          onClick={() => zoom(-0.1)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Zoom Out"
        >
          <FiZoomOut />
        </button>
        <button
          onClick={() => rotate(90)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Rotate"
        >
          <FiRotateCw />
        </button>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => inputRef.current.click()}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Upload New"
        >
          <FiCamera />
        </button>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
        >
          <FiX className="inline mr-2" />
          Cancel
        </button>
        <button
          onClick={getCropData}
          className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white"
        >
          <FiCheck className="inline mr-2" />
          Save
        </button>
      </div>
    </div>
  );
};

export default AvatarEditor;