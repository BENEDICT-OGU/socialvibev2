import { useState, useRef } from "react";
import {
  FiCamera,
  FiVideo,
  FiMic,
  FiMusic,
  FiUpload,
  FiEdit,
  FiTrash2,
  FiCrop,
  FiType,
  FiSmile,
  FiPlus,
  FiX,
} from "react-icons/fi";
import {
  FaMagic,
  FaObjectGroup,
  FaVolumeUp,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import { MdSlowMotionVideo, MdTimelapse } from "react-icons/md";
import { RiBarcodeBoxLine } from "react-icons/ri";
import { BsBrightnessHigh, BsDroplet } from "react-icons/bs";
import { AiOutlineBgColors, AiOutlineLine } from "react-icons/ai";
import ReactPlayer from "react-player";
import Cropper from "react-easy-crop";
import { Button, Tabs, Tab, Modal, Dropdown } from 'react-bootstrap';
import RangeSlider from "react-bootstrap-range-slider";

const CreateStory = () => {
  // State management
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [editorTool, setEditorTool] = useState("adjust");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // Media handling
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      file,
      type: file.type.startsWith("image") ? "image" : "video",
      url: URL.createObjectURL(file),
      edits: {},
    }));
    setMediaFiles([...mediaFiles, ...newMedia]);
  };

  const applyFilter = (filterType, value) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles[currentSlide].edits[filterType] = value;
    setMediaFiles(updatedFiles);
  };

  // Render functions
  const renderMediaUploadOptions = () => (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create New Story</h3>
      <div className="grid grid-cols-2 gap-4 w-full">
        {[
          { icon: <FiUpload size={20} />, label: "Upload", onClick: () => fileInputRef.current.click() },
          { icon: <FiCamera size={20} />, label: "Camera", onClick: () => setShowEditor(true) },
          { icon: <FiVideo size={20} />, label: "Video", onClick: () => setShowEditor(true) },
          { icon: <FiMusic size={20} />, label: "Music", onClick: () => setShowAudioPanel(true) },
        ].map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 border border-gray-100"
          >
            <span className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full text-blue-500 mb-2">
              {item.icon}
            </span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*,video/*,audio/*"
        className="hidden"
      />
    </div>
  );

  const renderEditorTools = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Tabs
        activeKey={editorTool}
        onSelect={(k) => setEditorTool(k)}
        className="border-b border-gray-100"
      >
        <Tab
          eventKey="adjust"
          title={
            <div className="flex items-center px-3 py-2 text-sm font-medium">
              <AiOutlineBgColors className="mr-2" />
              Adjust
            </div>
          }
        >
          <div className="p-4 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                <div className="flex items-center">
                  <BsBrightnessHigh className="mr-2" />
                  Brightness
                </div>
                <span>{brightness}%</span>
              </div>
              <RangeSlider
                value={brightness}
                min={0}
                max={200}
                tooltip="off"
                onChange={(e) => {
                  setBrightness(e.target.value);
                  applyFilter("brightness", e.target.value);
                }}
                className="custom-slider"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                <div>Contrast</div>
                <span>{contrast}%</span>
              </div>
              <RangeSlider
                value={contrast}
                min={0}
                max={200}
                tooltip="off"
                onChange={(e) => {
                  setContrast(e.target.value);
                  applyFilter("contrast", e.target.value);
                }}
                className="custom-slider"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                <div className="flex items-center">
                  <BsDroplet className="mr-2" />
                  Saturation
                </div>
                <span>{saturation}%</span>
              </div>
              <RangeSlider
                value={saturation}
                min={0}
                max={200}
                tooltip="off"
                onChange={(e) => {
                  setSaturation(e.target.value);
                  applyFilter("saturation", e.target.value);
                }}
                className="custom-slider"
              />
            </div>
          </div>
        </Tab>
        <Tab
          eventKey="crop"
          title={
            <div className="flex items-center px-3 py-2 text-sm font-medium">
              <FiCrop className="mr-2" />
              Crop
            </div>
          }
        >
          <div className="p-4">
            <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
              {mediaFiles[currentSlide]?.url && (
                <Cropper
                  image={mediaFiles[currentSlide]?.url}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                  classes={{ containerClassName: "rounded-lg" }}
                />
              )}
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-500 mb-2">Zoom</div>
              <RangeSlider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                tooltip="off"
                onChange={(e) => setZoom(e.target.value)}
                className="custom-slider"
              />
            </div>
          </div>
        </Tab>
        <Tab
          eventKey="text"
          title={
            <div className="flex items-center px-3 py-2 text-sm font-medium">
              <FiType className="mr-2" />
              Text
            </div>
          }
        >
          <div className="p-4 space-y-4">
            <input
              type="text"
              placeholder="Type something..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              {['Font', 'Color', 'Animation'].map((item) => (
                <button
                  key={item}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );

  const renderMediaPreview = () => (
    <div className="relative flex items-center justify-center w-full h-full bg-black rounded-xl overflow-hidden">
      {mediaFiles[currentSlide]?.type === "image" ? (
        <img
          src={mediaFiles[currentSlide]?.url}
          alt="Story content"
          className="max-h-[70vh] object-contain"
          style={{
            filter: `
              brightness(${mediaFiles[currentSlide]?.edits.brightness || 100}%)
              contrast(${mediaFiles[currentSlide]?.edits.contrast || 100}%)
              saturate(${mediaFiles[currentSlide]?.edits.saturation || 100}%)
            `,
          }}
        />
      ) : (
        <ReactPlayer
          url={mediaFiles[currentSlide]?.url}
          controls
          width="100%"
          height="100%"
          className="max-h-[70vh]"
        />
      )}
      <button className="absolute top-4 right-4 p-2 bg-gray-900 bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-all">
        <FiX size={18} />
      </button>
    </div>
  );

  const renderTimeline = () => (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-xs border border-gray-100 overflow-x-auto no-scrollbar">
      {mediaFiles.map((media, index) => (
        <div
          key={index}
          className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden cursor-pointer transition-all ${
            index === currentSlide ? "ring-2 ring-blue-500" : "opacity-70 hover:opacity-100"
          }`}
          onClick={() => setCurrentSlide(index)}
        >
          {media.type === "image" ? (
            <img
              src={media.url}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <FiVideo className="text-white text-sm" />
            </div>
          )}
        </div>
      ))}
      <button
        className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-200"
        onClick={() => fileInputRef.current.click()}
      >
        <FiPlus className="text-gray-500" />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-xs py-3 px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900">Create Story</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              {showEditor ? "Preview" : "Edit"}
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
              Share Story
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        {!mediaFiles.length ? (
          <div className="flex items-center justify-center h-full">
            {renderMediaUploadOptions()}
          </div>
        ) : showEditor ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[70vh]">
              {renderMediaPreview()}
            </div>
            <div className="lg:col-span-1">
              {renderEditorTools()}
            </div>
          </div>
        ) : (
          <div className="flex justify-center h-[70vh]">
            {renderMediaPreview()}
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-gray-100 py-3 px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {mediaFiles.length > 0 && renderTimeline()}

          <div className="flex flex-wrap justify-center gap-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                <FiEdit size={16} />
                <span>Edit</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg rounded-xl border border-gray-100 py-1">
                <Dropdown.Item
                  onClick={() => setEditorTool("adjust")}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <AiOutlineBgColors size={16} />
                  <span>Adjust</span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setEditorTool("crop")}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiCrop size={16} />
                  <span>Crop</span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => setEditorTool("text")}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FiType size={16} />
                  <span>Text</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                <FaMagic size={16} />
                <span>Effects</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-lg rounded-xl border border-gray-100 py-1">
                <Dropdown.Item className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <MdSlowMotionVideo size={16} />
                  <span>Slow Motion</span>
                </Dropdown.Item>
                <Dropdown.Item className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <MdTimelapse size={16} />
                  <span>Time Lapse</span>
                </Dropdown.Item>
                <Dropdown.Item className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <RiBarcodeBoxLine size={16} />
                  <span>Boomerang</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <button
              onClick={() => setShowAudioPanel(!showAudioPanel)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <FaVolumeUp size={16} />
              <span>Audio</span>
            </button>

            <button
              onClick={() => setShowDrawingTools(!showDrawingTools)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <AiOutlineLine size={16} />
              <span>Draw</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Audio Panel Modal */}
      <Modal show={showAudioPanel} onHide={() => setShowAudioPanel(false)} centered>
        <Modal.Body className="p-6 rounded-2xl">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Audio Settings</h3>
              <button onClick={() => setShowAudioPanel(false)} className="p-1 rounded-full hover:bg-gray-100">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <button className="flex items-center space-x-3 w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-500">
                  <FiMusic size={18} />
                </div>
                <span className="text-sm font-medium">Add Music</span>
              </button>
              <button className="flex items-center space-x-3 w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg text-purple-500">
                  <FiMic size={18} />
                </div>
                <span className="text-sm font-medium">Record Voiceover</span>
              </button>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Volume</span>
                  <span>100%</span>
                </div>
                <RangeSlider
                  value={100}
                  min={0}
                  max={100}
                  tooltip="off"
                  className="custom-slider"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Drawing Tools Modal */}
      <Modal show={showDrawingTools} onHide={() => setShowDrawingTools(false)} centered>
        <Modal.Body className="p-6 rounded-2xl">
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Drawing Tools</h3>
              <button onClick={() => setShowDrawingTools(false)} className="p-1 rounded-full hover:bg-gray-100">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaUndo size={14} />
                  <span>Undo</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaRedo size={14} />
                  <span>Redo</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiTrash2 size={14} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">Brush Size</div>
                <RangeSlider
                  value={5}
                  min={1}
                  max={20}
                  tooltip="off"
                  className="custom-slider"
                />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">Color</div>
                <div className="flex space-x-2">
                  {["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#000000", "#FFFFFF"].map(
                    (color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border border-gray-200 hover:ring-2 hover:ring-gray-300 transition-all"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateStory;