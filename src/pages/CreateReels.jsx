import { useRef, useState, useEffect, useCallback } from "react";
import {
  FaHeart,
  FaRegCommentDots,
  FaShare,
  FaMusic,
  FaVolumeMute,
  FaVolumeUp,
  FaPlay,
  FaPause,
  FaCut,
  FaFilter,
  FaTextHeight,
  FaTimes,
  FaCheck,
  FaArrowsAlt,
  FaCamera,
  FaCloudUploadAlt,
  FaMicrophone,
  FaMagic,
  FaStickyNote,
  FaHashtag,
  FaUserTag,
  FaMapMarkerAlt,
  FaChartLine,
  FaCog,
  FaLightbulb,
  FaUsers,
  FaDollarSign,
  FaClock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ReelsEditor() {
  // Core states
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(100);
  const [isReversed, setIsReversed] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  
  // Editing features
  const [activeTool, setActiveTool] = useState(null);
  const [activeSubTool, setActiveSubTool] = useState(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioVolume, setAudioVolume] = useState(100);
  const [voiceoverUrl, setVoiceoverUrl] = useState(null);
  const [isRecordingVoiceover, setIsRecordingVoiceover] = useState(false);
  const [videoSegments, setVideoSegments] = useState([]);
  const [activeSegment, setActiveSegment] = useState(0);
  
  // Visual effects
  const [filters, setFilters] = useState([
    { name: "Normal", class: "" },
    { name: "Clarendon", class: "filter-clarendon" },
    { name: "Gingham", class: "filter-gingham" },
    { name: "Moon", class: "filter-moon" },
    { name: "Lark", class: "filter-lark" },
    { name: "Sepia", class: "filter-sepia" },
    { name: "B&W", class: "filter-bw" },
    { name: "Vintage", class: "filter-vintage" },
    { name: "Dramatic", class: "filter-dramatic" },
  ]);
  const [activeFilter, setActiveFilter] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [exposure, setExposure] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const [zoomEffect, setZoomEffect] = useState(1);
  
  // Text & overlays
  const [captions, setCaptions] = useState([]);
  const [editingCaption, setEditingCaption] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [activeStickerPack, setActiveStickerPack] = useState("trending");
  const [hashtags, setHashtags] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [location, setLocation] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  
  // Post settings
  const [privacy, setPrivacy] = useState("public");
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [category, setCategory] = useState("entertainment");
  
  // AI features
  const [aiCaptionSuggestions, setAiCaptionSuggestions] = useState([]);
  const [aiHashtagSuggestions, setAiHashtagSuggestions] = useState([]);
  const [aiMusicSuggestions, setAiMusicSuggestions] = useState([]);
  const [faceDetection, setFaceDetection] = useState(false);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const captionContainerRef = useRef(null);
  const voiceoverRecorderRef = useRef(null);
  const cameraVideoRef = useRef(null);

  // Load sample data
  useEffect(() => {
    // Sample audio tracks
    setAudioTracks([
      { id: 1, name: "Trending Sound 1", url: "/audio/trending1.mp3" },
      { id: 2, name: "Popular Song Clip", url: "/audio/popular.mp3" },
      { id: 3, name: "Viral Audio", url: "/audio/viral.mp3" },
    ]);
    
    // Sample AI suggestions
    setAiCaptionSuggestions([
      "Check out this amazing clip! ✨",
      "When the vibe is just right 😎",
      "POV: You're living your best life",
      "This took me way too long to make 😅"
    ]);
    
    setAiHashtagSuggestions([
      "#viral #trending #fyp",
      "#funny #comedy #lol",
      "#dance #music #party",
      "#art #creative #design"
    ]);
    
    setAiMusicSuggestions([
      { id: 101, name: "Upbeat Pop", mood: "happy" },
      { id: 102, name: "Chill Vibes", mood: "relaxed" },
      { id: 103, name: "Energetic Rock", mood: "exciting" },
      { id: 104, name: "Romantic Strings", mood: "romantic" }
    ]);
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setVideoSegments([{ file, url: URL.createObjectURL(file) }]);
      setTrimEnd(duration);
    }
  };

  // Handle multiple file selection
  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const segments = files.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setVideoSegments(segments);
      setVideoFile(files[0]);
      setVideoUrl(URL.createObjectURL(files[0]));
      setActiveSegment(0);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setMediaStream(stream);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setShowCamera(false);
  };

  // Record from camera
  const recordFromCamera = () => {
    // Implementation for recording from camera
    console.log("Recording from camera...");
  };

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    setTrimEnd(videoRef.current.duration);
  };

  // Time update handler
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  // Play/pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Trim video handler
  const applyTrim = () => {
    videoRef.current.currentTime = trimStart;
    if (isPlaying) videoRef.current.play();
  };

  // Change playback speed
  const changeSpeed = (speed) => {
    setPlaybackRate(speed);
    videoRef.current.playbackRate = speed;
  };

  // Reverse video
  const toggleReverse = () => {
    setIsReversed(!isReversed);
    // Note: Actual video reversal requires more complex implementation
    // This is just a UI toggle for demonstration
  };

  // Add caption
  const addCaption = () => {
    const newCaption = {
      id: Date.now(),
      text: "Your text here",
      x: 50,
      y: 50,
      color: "#ffffff",
      fontSize: 24,
      animation: "none"
    };
    setCaptions([...captions, newCaption]);
    setEditingCaption(newCaption.id);
  };

  // Add sticker
  const addSticker = (sticker) => {
    const newSticker = {
      id: Date.now(),
      type: sticker.type,
      url: sticker.url,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setStickers([...stickers, newSticker]);
  };

  // Handle caption movement
  const handleCaptionMove = (id, e) => {
    const container = captionContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    
    setCaptions(captions.map(caption => 
      caption.id === id ? { ...caption, x, y } : caption
    ));
  };

  // Handle sticker movement
  const handleStickerMove = (id, e) => {
    const container = captionContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    
    setStickers(stickers.map(sticker => 
      sticker.id === id ? { ...sticker, x, y } : sticker
    ));
  };

  // Start recording voiceover
  const startVoiceoverRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceoverUrl(audioUrl);
      };
      
      recorder.start();
      voiceoverRecorderRef.current = recorder;
      setIsRecordingVoiceover(true);
    } catch (err) {
      console.error("Error recording voiceover:", err);
    }
  };

  // Stop recording voiceover
  const stopVoiceoverRecording = () => {
    if (voiceoverRecorderRef.current) {
      voiceoverRecorderRef.current.stop();
      voiceoverRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecordingVoiceover(false);
    }
  };

  // Generate AI captions
  const generateAiCaptions = () => {
    // In a real app, this would call an API
    return aiCaptionSuggestions;
  };

  // Generate AI hashtags
  const generateAiHashtags = () => {
    // In a real app, this would call an API
    return aiHashtagSuggestions;
  };

  // Render video with all effects
  const renderVideoWithEffects = () => {
    const filterStyle = {
      filter: `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        blur(${blurAmount}px)
      `,
      transform: `scale(${zoomEffect})`
    };

    return (
      <div className={`relative w-full h-full ${activeFilter}`}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          style={filterStyle}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          muted={isMuted}
          loop
        />
        
        {/* Captions */}
        {captions.map((caption) => (
          <div
            key={caption.id}
            className={`absolute text-white ${editingCaption === caption.id ? "ring-2 ring-pink-500" : ""}`}
            style={{
              left: `${caption.x}%`,
              top: `${caption.y}%`,
              color: caption.color,
              fontSize: `${caption.fontSize}px`,
              transform: "translate(-50%, -50%)",
              cursor: "move",
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", caption.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id === caption.id) return;
              handleCaptionMove(id, e);
            }}
            onClick={() => setEditingCaption(caption.id)}
          >
            {caption.text}
          </div>
        ))}
        
        {/* Stickers */}
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="absolute"
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
              cursor: "move",
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", sticker.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id === sticker.id) return;
              handleStickerMove(id, e);
            }}
          >
            <img 
              src={sticker.url} 
              alt="sticker" 
              className="h-16 w-16 object-contain"
            />
          </div>
        ))}
        
        {/* Face detection boxes (simulated) */}
        {faceDetection && (
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-green-500 rounded-full">
            <div className="absolute top-0 left-0 w-8 h-8 border-2 border-green-500 rounded-full"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-2 border-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    );
  };

  // Tool sections
  const toolSections = [
    {
      id: "upload",
      name: "Upload",
      icon: <FaCloudUploadAlt />,
      subtools: [
        { id: "upload-video", name: "From Device" },
        { id: "record", name: "Record" },
        { id: "cloud", name: "From Cloud" }
      ]
    },
    {
      id: "edit",
      name: "Edit",
      icon: <FaCut />,
      subtools: [
        { id: "trim", name: "Trim" },
        { id: "cut", name: "Cut" },
        { id: "merge", name: "Merge" },
        { id: "speed", name: "Speed" },
        { id: "reverse", name: "Reverse" },
        { id: "volume", name: "Volume" },
        { id: "crop", name: "Crop" }
      ]
    },
    {
      id: "audio",
      name: "Audio",
      icon: <FaMusic />,
      subtools: [
        { id: "music", name: "Music" },
        { id: "voiceover", name: "Voiceover" },
        { id: "effects", name: "Effects" },
        { id: "sync", name: "Sync" },
        { id: "ducking", name: "Ducking" }
      ]
    },
    {
      id: "effects",
      name: "Effects",
      icon: <FaMagic />,
      subtools: [
        { id: "filters", name: "Filters" },
        { id: "beauty", name: "Beauty" },
        { id: "ar", name: "AR" },
        { id: "transitions", name: "Transitions" },
        { id: "blur", name: "Blur" }
      ]
    },
    {
      id: "text",
      name: "Text",
      icon: <FaTextHeight />,
      subtools: [
        { id: "captions", name: "Captions" },
        { id: "stickers", name: "Stickers" },
        { id: "emojis", name: "Emojis" },
        { id: "subtitles", name: "Subtitles" }
      ]
    },
    {
      id: "metadata",
      name: "Details",
      icon: <FaStickyNote />,
      subtools: [
        { id: "caption", name: "Caption" },
        { id: "hashtags", name: "Hashtags" },
        { id: "tags", name: "Tags" },
        { id: "location", name: "Location" }
      ]
    },
    {
      id: "settings",
      name: "Settings",
      icon: <FaCog />,
      subtools: [
        { id: "privacy", name: "Privacy" },
        { id: "comments", name: "Comments" },
        { id: "download", name: "Download" },
        { id: "schedule", name: "Schedule" }
      ]
    },
    {
      id: "ai",
      name: "AI Tools",
      icon: <FaLightbulb />,
      subtools: [
        { id: "ai-captions", name: "AI Captions" },
        { id: "ai-hashtags", name: "AI Hashtags" },
        { id: "ai-music", name: "AI Music" },
        { id: "ai-enhance", name: "Enhance" }
      ]
    }
  ];

  // Render subtool panel
  const renderSubToolPanel = () => {
    switch (activeSubTool) {
      case "trim":
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Trim Video</h3>
              <div className="flex gap-2">
                <button className="p-1 text-gray-400 hover:text-white" onClick={togglePlay}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="p-1 text-gray-400 hover:text-white" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <Slider
                min={0}
                max={duration}
                value={currentTime}
                onChange={(val) => { videoRef.current.currentTime = val; }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Select Range</h4>
              <div className="relative h-10 bg-gray-700 rounded">
                <Slider
                  range
                  min={0}
                  max={duration}
                  value={[trimStart, trimEnd]}
                  onChange={([start, end]) => {
                    setTrimStart(start);
                    setTrimEnd(end);
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(trimStart)}</span>
                <span>{formatTime(trimEnd)}</span>
              </div>
            </div>
            <button
              className="w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600"
              onClick={applyTrim}
            >
              Apply Trim
            </button>
          </div>
        );
      
      case "speed":
        return (
          <div>
            <h3 className="font-medium mb-4">Playback Speed</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[0.5, 0.75, 1, 1.5, 2, 3].map(speed => (
                <button
                  key={speed}
                  className={`py-2 rounded-lg ${playbackRate === speed ? 'bg-pink-500' : 'bg-gray-700'}`}
                  onClick={() => changeSpeed(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        );
      
      case "reverse":
        return (
          <div>
            <h3 className="font-medium mb-4">Reverse Video</h3>
            <button
              className={`w-full py-2 rounded-lg ${isReversed ? 'bg-pink-500' : 'bg-gray-700'}`}
              onClick={toggleReverse}
            >
              {isReversed ? 'Revert to Normal' : 'Reverse Video'}
            </button>
          </div>
        );
      
      case "volume":
        return (
          <div>
            <h3 className="font-medium mb-4">Audio Volume</h3>
            <div className="flex items-center gap-4 mb-4">
              <FaVolumeMute />
              <Slider
                className="flex-1"
                min={0}
                max={100}
                value={volume}
                onChange={(val) => {
                  setVolume(val);
                  videoRef.current.volume = val / 100;
                }}
              />
              <FaVolumeUp />
            </div>
          </div>
        );
      
      case "music":
        return (
          <div>
            <h3 className="font-medium mb-4">Sound</h3>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                <FaMusic className="mr-3" />
                <div className="flex-1">
                  <p className="font-medium">Original Audio</p>
                  <p className="text-xs text-gray-400">Volume: {volume}%</p>
                </div>
                <Slider
                  className="w-20"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(val) => {
                    setVolume(val);
                    videoRef.current.volume = val / 100;
                  }}
                />
              </div>
              {audioTracks.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedAudio === track.id ? "bg-pink-500/20 border border-pink-500" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => setSelectedAudio(track.id)}
                >
                  <FaMusic className="mr-3" />
                  <div className="flex-1">
                    <p className="font-medium">{track.name}</p>
                    <p className="text-xs text-gray-400">0:15</p>
                  </div>
                  {selectedAudio === track.id && (
                    <FaCheck className="text-pink-500" />
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border border-dashed border-gray-500 py-3 rounded-lg hover:bg-gray-700">
              Add Sound
            </button>
          </div>
        );
      
      case "voiceover":
        return (
          <div>
            <h3 className="font-medium mb-4">Voiceover</h3>
            {voiceoverUrl ? (
              <div className="mb-4">
                <audio controls src={voiceoverUrl} className="w-full mb-2" />
                <button
                  className="w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600"
                  onClick={() => setVoiceoverUrl(null)}
                >
                  Remove Voiceover
                </button>
              </div>
            ) : (
              <button
                className={`w-full py-3 rounded-lg mb-4 ${isRecordingVoiceover ? 'bg-red-500' : 'bg-pink-500 hover:bg-pink-600'}`}
                onClick={isRecordingVoiceover ? stopVoiceoverRecording : startVoiceoverRecording}
              >
                {isRecordingVoiceover ? 'Stop Recording' : 'Record Voiceover'}
              </button>
            )}
            <div className="flex items-center gap-4">
              <FaVolumeMute />
              <Slider
                className="flex-1"
                min={0}
                max={100}
                value={audioVolume}
                onChange={(val) => setAudioVolume(val)}
              />
              <FaVolumeUp />
            </div>
          </div>
        );
      
      case "filters":
        return (
          <div>
            <h3 className="font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-3 gap-3">
              {filters.map((filter) => (
                <div
                  key={filter.name}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${activeFilter === filter.class ? "ring-2 ring-pink-500" : ""}`}
                  onClick={() => setActiveFilter(filter.class)}
                >
                  <div className={`w-full h-full ${filter.class} bg-gray-600 flex items-center justify-center`}>
                    <span className="text-xs">{filter.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "beauty":
        return (
          <div>
            <h3 className="font-medium mb-4">Beauty Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Smooth Skin</label>
                <Slider min={0} max={100} defaultValue={50} />
              </div>
              <div>
                <label className="block text-sm mb-1">Bright Eyes</label>
                <Slider min={0} max={100} defaultValue={50} />
              </div>
              <div>
                <label className="block text-sm mb-1">Whiten Teeth</label>
                <Slider min={0} max={100} defaultValue={50} />
              </div>
            </div>
          </div>
        );
      
      case "captions":
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Captions</h3>
              <button
                className="bg-pink-500 px-3 py-1 rounded-full text-sm hover:bg-pink-600"
                onClick={addCaption}
              >
                Add
              </button>
            </div>
            {captions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No captions added yet
              </p>
            ) : (
              <div className="space-y-4">
                {captions.map((caption) => (
                  <div
                    key={caption.id}
                    className={`p-3 rounded-lg ${editingCaption === caption.id ? "bg-pink-500/20 border border-pink-500" : "bg-gray-700"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Caption</span>
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setCaptions(captions.filter(c => c.id !== caption.id));
                          if (editingCaption === caption.id) {
                            setEditingCaption(null);
                          }
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={caption.text}
                      onChange={(e) => {
                        setCaptions(captions.map(c => 
                          c.id === caption.id 
                            ? { ...c, text: e.target.value } 
                            : c
                        ));
                      }}
                      className="w-full bg-gray-800 rounded px-2 py-1 mb-2"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-xs">Color:</label>
                      <input
                        type="color"
                        value={caption.color}
                        onChange={(e) => {
                          setCaptions(captions.map(c => 
                            c.id === caption.id 
                              ? { ...c, color: e.target.value } 
                              : c
                          ));
                        }}
                        className="w-6 h-6"
                      />
                      <label className="text-xs ml-2">Size:</label>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={caption.fontSize}
                        onChange={(e) => {
                          setCaptions(captions.map(c => 
                            c.id === caption.id 
                              ? { ...c, fontSize: parseInt(e.target.value) } 
                              : c
                          ));
                        }}
                        className="flex-1"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="text-xs block mb-1">Animation:</label>
                      <select
                        value={caption.animation}
                        onChange={(e) => {
                          setCaptions(captions.map(c => 
                            c.id === caption.id 
                              ? { ...c, animation: e.target.value } 
                              : c
                          ));
                        }}
                        className="w-full bg-gray-800 rounded px-2 py-1 text-sm"
                      >
                        <option value="none">None</option>
                        <option value="fade">Fade In</option>
                        <option value="slide">Slide Up</option>
                        <option value="bounce">Bounce</option>
                      </select>
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 bg-gray-700 py-1 rounded text-sm hover:bg-gray-600"
                      onClick={() => setEditingCaption(caption.id)}
                    >
                      <FaArrowsAlt size={12} /> Reposition on Video
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case "stickers":
        return (
          <div>
            <h3 className="font-medium mb-4">Stickers</h3>
            <div className="flex gap-2 mb-4">
              {["trending", "emojis", "animated", "custom"].map(pack => (
                <button
                  key={pack}
                  className={`px-3 py-1 rounded-full text-sm ${activeStickerPack === pack ? 'bg-pink-500' : 'bg-gray-700'}`}
                  onClick={() => setActiveStickerPack(pack)}
                >
                  {pack.charAt(0).toUpperCase() + pack.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <button
                  key={i}
                  className="aspect-square bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center justify-center"
                  onClick={() => addSticker({
                    type: "sticker",
                    url: `/stickers/${activeStickerPack}/${i}.png`
                  })}
                >
                  <span className="text-2xl">🎯</span>
                </button>
              ))}
            </div>
          </div>
        );
      
      case "caption":
        return (
          <div>
            <h3 className="font-medium mb-4">Post Caption</h3>
            <textarea
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="w-full bg-gray-800 rounded-lg p-3 mb-4 h-24"
              placeholder="Write a caption..."
            />
            <div className="flex gap-2 mb-4">
              <button className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600">
                Add Hashtags
              </button>
              <button className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600">
                Tag People
              </button>
            </div>
            <button className="w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
              Generate AI Suggestions
            </button>
          </div>
        );
      
      case "hashtags":
        return (
          <div>
            <h3 className="font-medium mb-4">Hashtags</h3>
            <textarea
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full bg-gray-800 rounded-lg p-3 mb-4 h-24"
              placeholder="#trending #viral #fyp"
            />
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium">AI Suggestions</h4>
              {aiHashtagSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  className="w-full text-left bg-gray-700 p-2 rounded-lg hover:bg-gray-600 text-sm"
                  onClick={() => setHashtags(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        );
      
      case "privacy":
        return (
          <div>
            <h3 className="font-medium mb-4">Privacy</h3>
            <div className="space-y-3">
              {["public", "friends", "private"].map(option => (
                <div key={option} className="flex items-center justify-between">
                  <label className="capitalize">{option}</label>
                  <input
                    type="radio"
                    name="privacy"
                    checked={privacy === option}
                    onChange={() => setPrivacy(option)}
                  />
                </div>
              ))}
            </div>
            
            <h3 className="font-medium mt-6 mb-4">Permissions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label>Allow Comments</label>
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={() => setAllowComments(!allowComments)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Allow Duet/Remix</label>
                <input
                  type="checkbox"
                  checked={allowDuet}
                  onChange={() => setAllowDuet(!allowDuet)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Allow Download</label>
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={() => setAllowDownload(!allowDownload)}
                />
              </div>
            </div>
          </div>
        );
      
      case "schedule":
        return (
          <div>
            <h3 className="font-medium mb-4">Schedule Post</h3>
            <div className="flex items-center justify-between mb-4">
              <label>Schedule Time:</label>
              <input
                type="datetime-local"
                value={scheduleTime || ''}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="bg-gray-800 rounded px-2 py-1"
              />
            </div>
            <button className="w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
              Schedule
            </button>
          </div>
        );
      
      case "ai-captions":
        return (
          <div>
            <h3 className="font-medium mb-4">AI Caption Suggestions</h3>
            <div className="space-y-2">
              {aiCaptionSuggestions.map((caption, i) => (
                <button
                  key={i}
                  className="w-full text-left bg-gray-700 p-3 rounded-lg hover:bg-gray-600"
                  onClick={() => setCaptionText(caption)}
                >
                  {caption}
                </button>
              ))}
            </div>
            <button className="w-full bg-pink-500 py-2 rounded-lg mt-4 hover:bg-pink-600">
              Generate More
            </button>
          </div>
        );
      
      case "ai-hashtags":
        return (
          <div>
            <h3 className="font-medium mb-4">AI Hashtag Suggestions</h3>
            <div className="space-y-2">
              {aiHashtagSuggestions.map((hashtags, i) => (
                <button
                  key={i}
                  className="w-full text-left bg-gray-700 p-3 rounded-lg hover:bg-gray-600"
                  onClick={() => setHashtags(hashtags)}
                >
                  {hashtags}
                </button>
              ))}
            </div>
            <button className="w-full bg-pink-500 py-2 rounded-lg mt-4 hover:bg-pink-600">
              Generate More
            </button>
          </div>
        );
      
      case "ai-music":
        return (
          <div>
            <h3 className="font-medium mb-4">AI Music Matching</h3>
            <div className="space-y-2">
              {aiMusicSuggestions.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedAudio === track.id ? "bg-pink-500/20 border border-pink-500" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => setSelectedAudio(track.id)}
                >
                  <FaMusic className="mr-3" />
                  <div className="flex-1">
                    <p className="font-medium">{track.name}</p>
                    <p className="text-xs text-gray-400">{track.mood}</p>
                  </div>
                  {selectedAudio === track.id && (
                    <FaCheck className="text-pink-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-400">
            Select a tool to begin editing
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      {/* <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <button className="text-gray-400 hover:text-white">
          <FaTimes size={20} />
        </button>
        <h1 className="text-xl font-bold">Create Reel</h1>
        <button className="bg-pink-500 px-4 py-1 rounded-full hover:bg-pink-600">
          Next
        </button>
      </header> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Video Preview Area */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {showCamera ? (
            <div className="w-full h-full">
              <video
                ref={cameraVideoRef}
                autoPlay
                muted
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  className="bg-red-500 h-12 w-12 rounded-full flex items-center justify-center"
                  onClick={recordFromCamera}
                >
                  <FaCamera />
                </button>
                <button
                  className="bg-gray-700 h-12 w-12 rounded-full flex items-center justify-center hover:bg-gray-600"
                  onClick={stopCamera}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : videoUrl ? (
            <div className="w-full h-full" ref={captionContainerRef}>
              {renderVideoWithEffects()}
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex flex-col items-center"
                >
                  <FaCloudUploadAlt size={24} className="mb-2" />
                  <span>Upload Video</span>
                </button>
                <button
                  onClick={startCamera}
                  className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex flex-col items-center"
                >
                  <FaCamera size={24} className="mb-2" />
                  <span>Record</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <input
                  type="file"
                  id="multi-upload"
                  onChange={handleMultipleFilesChange}
                  accept="video/*"
                  multiple
                  className="hidden"
                />
              </div>
              <p className="text-gray-400 mb-4">or</p>
              <div className="flex justify-center gap-4">
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaCloudUploadAlt /> From Cloud
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaUsers /> Collaborate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Editing Tools Panel */}
        <div className="w-full md:w-96 bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 overflow-y-auto">
          {!videoUrl && !showCamera ? (
            <div className="p-4 text-center text-gray-400">
              Upload or record a video to begin editing
            </div>
          ) : (
            <>
              {/* Main Tool Selection */}
              <div className="flex overflow-x-auto border-b border-gray-700">
                {toolSections.map((tool) => (
                  <button
                    key={tool.id}
                    className={`flex flex-col items-center p-3 min-w-16 ${activeTool === tool.id ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400"}`}
                    onClick={() => {
                      setActiveTool(tool.id);
                      setActiveSubTool(tool.subtools[0].id);
                    }}
                  >
                    {tool.icon}
                    <span className="text-xs mt-1">{tool.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Subtool Selection */}
              {activeTool && (
                <div className="flex overflow-x-auto border-b border-gray-700">
                  {toolSections.find(t => t.id === activeTool)?.subtools.map((subtool) => (
                    <button
                      key={subtool.id}
                      className={`px-4 py-2 whitespace-nowrap ${activeSubTool === subtool.id ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400"}`}
                      onClick={() => setActiveSubTool(subtool.id)}
                    >
                      {subtool.name}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Tool Panel Content */}
              <div className="p-4">
                {renderSubToolPanel()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}