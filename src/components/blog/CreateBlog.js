import React, { useEffect, useState } from "react";
import Upload from "../imageView/Upload";
import { FiImage } from "react-icons/fi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Item from "antd/es/list/Item";

export default function CreateBlog() {
  const [ImageView, setImageView] = useState(0);
  const handleSetImage = (e, col) => {
    console.log(col, "cccccccccccccccccc");
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageView(ImageView+1)
      const newCols = Cols.map((colM, index) => {
        if (colM.id === col.id) {
          return {
            ...colM,
            items: [...col.items, { url, id: ImageView }],
          };
        }
        return colM;
      });

      // Cập nhật state
      setCols(newCols);
    }
  };

  const [InputSend, setInputSend] = useState([]);
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
  const [Cols, setCols] = useState([
    { id: 1, items: [] },
    { id: 2, items: [] },
  ]);
useEffect(() => {
  console.log(Cols,"dmmmmmmmm")
}, [Cols]);
  const handleDragEnd = (e) => {
    const { destination, source, draggableId } = e;
    console.log(e,'eeeeeeeee')
    try {
      // Nếu không có vị trí đích (kéo ra ngoài vùng droppable)
      if (!destination) {
        setCols((prevCols) => [
          ...prevCols,
          { id: Cols.length + 1, items: [] },
        ]);
        return;
      }

      // Nếu không có sự thay đổi vị trí
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // Tìm cột bắt đầu và kết thúc
      const startCol = Cols.find(
        (col) => col.id === Number(source.droppableId)
      );
      const finishCol = Cols.find(
        (col) => col.id === Number(destination.droppableId)
      );

      if (!startCol || !finishCol) return;

      // Trường hợp di chuyển trong cùng một cột
      if (startCol === finishCol) {
        console.log(source.index, destination.index, "eeeeeeeeee");
        const newItems = [...startCol.items];
        const [movedItem] = newItems.splice(source.index, 1); 
        newItems.splice(destination.index, 0, movedItem);
        const updatedCols = Cols.map((col) => {
          if (col.id === startCol.id) {
            return { ...col, items: newItems };
          }
          return col;
        });

        setCols(updatedCols);
        return;
      }

      const startItems = [...startCol.items];
      const finishItems = [...finishCol.items];

      const [movedItem] = startItems.splice(source.index, 1);
      finishItems.splice(destination.index, 0, movedItem);
      const updatedCols = Cols.map((col) => {
        if (col.id === startCol.id) {
          return { ...col, items: startItems }; 
        }
        if (col.id === finishCol.id) {
          return { ...col, items: finishItems }; 
        }
        return col; // Các cột khác giữ nguyên
      });

      setCols(updatedCols);
    } catch (error) {}
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="content">
          <div>CreateBlog</div>
          <div className="w-full center">
            {Cols.map((col) => (
              <div className="w-20vw">
                <Droppable droppableId={col.id.toString()}>
                  {(provided) => (
                    <>
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
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="relative  my-10"
                      >
                        {col.items &&
                          col.items.map((img, index) => (
                            <Draggable
                              key={img.id}
                              draggableId={img.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="w-20vw"
                                >
                                  <div className="relative group">
                                    <span className="circleButton absolute top-8 right-12 hidden group-hover:flex cursor-pointer">
                                      X
                                    </span>
                                    <img
                                      src={img.url}
                                      alt="BlogImage"
                                      className="w-full py-2 h-30vh object-cover hover:cursor-pointer"
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}{" "}
                        {/* Đây là placeholder cho Droppable */}
                      </div>
                      <div class="flex items-center justify-center w-full">
                        <label
                          for={col.id}
                          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiImage size={20} className="m-4"></FiImage>
                            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span class="font-semibold">Click to upload</span>{" "}
                              or drag and drop
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <input
                            id={col.id}
                            onChange={(e) => handleSetImage(e, col)}
                            type="file"
                            class="hidden"
                          />
                        </label>
                      </div>
                    </>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </>
  );
}
