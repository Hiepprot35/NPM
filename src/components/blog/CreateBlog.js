import React, { useEffect, useState } from "react";
import Upload from "../imageView/Upload";
import { FiImage } from "react-icons/fi";

export default function CreateBlog() {
  const [ImageView, setImageView] = useState([]);
  const handleSetImage = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageView((e) => [...e, { url, index }]);
    }
  };
  const [userInput, setUserInput] = useState("");
  const [isInputText, setIsInputText] = useState(false);
  const [DragItem, setDragItem] = useState();
  const handleInputChange = (e) => {
    setUserInput(e); // Cập nhật văn bản từ vùng nhập
  };
  const handleInputText = () => {
    setIsInputText(true);
  };
  useEffect(() => {
    if (userInput.length === 0) {
      setIsInputText(false);
    }
  }, [userInput]);
  const handleDragStart = (e, img) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    setDragItem(img)
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };
  const handleDragOver = (e, img,index) => {

    try {
      const draggedData = DragItem;
      if (draggedData.index === img.index) {
        return;
      }

      const newItems = ImageView.filter(
        (item) => item.index !== draggedData.index
      );
      newItems.splice(index, 0, draggedData); 
      setImageView(newItems); // Cập nhật state
    } catch (error) {
      console.error("Không thể đọc dữ liệu draggedItem:", error);
    }
  };

  const handleDragEnd = () => {};

  return (
    <>
      <div className="content">
        <div>CreateBlog</div>
        <div className="w-full center">
          <div className="w-40vw">
            <div className="flex items-center justify-center w-full">
              {!isInputText ? (
                <label
                  onClick={handleInputText}
                  class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage size={20} className="m-4"></FiImage>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      Add text
                    </p>
                  </div>
                </label>
              ) : (
                <p
                  contentEditable // Cho phép chỉnh sửa nội dung
                  suppressContentEditableWarning={true} // Ẩn cảnh báo React
                  className="w-full border-2 border-gray-300 border-dashed rounded-lg cursor-text bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 p-4 overflow-y-auto"
                  onInput={handleInputChange} // Xử lý sự kiện nhập
                  placeholder="Click to add text"
                  style={{ outline: "none", direction: "ltr" }}
                ></p>
              )}
            </div>
            {ImageView.map((img, index) => {
              return (
                <div
                  className="m-4 transition-all	"
                  key={index}
                  onDragOver={(e) => handleDragOver(e, img,index)}
                >
                  <div
                    className="relative group "
                    draggable
                    onDragStart={(e) => handleDragStart(e, img)}
                    onDragEnd={handleDragEnd}
                    
                  >
                    <span className="circleButton absolute top-8 right-12 hidden group-hover:flex cursor-pointer">
                      X
                    </span>
                    <img
                      src={img.url}
                      alt="BlogImage"
                      className="w-full h-30vh object-cover hover:cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}

            <div class="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage size={20} className="m-4"></FiImage>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  onChange={(e) => handleSetImage(e, ImageView.length)}
                  type="file"
                  class="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
