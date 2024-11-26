import React, { useEffect, useState } from "react";
import Upload from "../imageView/Upload";
import { Popover } from "antd";
import { FiImage, FiList, FiPlusCircle } from "react-icons/fi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Item from "antd/es/list/Item";
import debounce from "lodash.debounce";

export default function CreateBlog() {
  const [ImageView, setImageView] = useState(0);
  const handleSetImage = (e, col) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageView(ImageView + 1);
      const newCols = Cols.map((colM, index) => {
        if (colM.id === col.id) {
          return {
            ...colM,
            items: [...col.items, { url, id: Date.now(), type: 2 }],
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
  const handleInputChange = (e, colIndex) => {
    // const newContent = e.target.innerText;

    const newCols = Cols.map((data) => {
      if (data.id === colIndex) {
        return {
          ...data,
          items: [...data.items, { content: "", type: 1, id: Date.now() }],
        };
      }
      return data;
    });
    // setIsInputText(false);
    setCols(newCols);
  };
  const handleInputText = (e, colIndex) => {
    setIsInputText(true);
  };
  useEffect(() => {
    if (userInput.length === 0) {
      setIsInputText(false);
    }
  }, [userInput]);
  const [Cols, setCols] = useState([{ id: 1, items: [] }]);

  const handleDragEnd = (e) => {
    const { destination, source, draggableId } = e;
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
  useEffect(() => {
    console.log(Cols);
  }, [Cols]);
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const InputText = ({ onBlur, placeholder, ...props }) => {
    return (
      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4 py-2 text-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200"
        contentEditable
        suppressContentEditableWarning={true}
        {...props}
        onBlur={onBlur}
      >
        {placeholder}
      </div>
    );
  };
  const InputText2 = ({ onBlur, placeholder, provided, id }) => {
    const onChangeHandle = (e) => {
      const text = e.target.innerText;

      const newCols = Cols.map((col) => ({
        ...col,
        items: col.items.map((item) =>
          item.id === id ? { ...item, content: text } : item
        ),
      }));

      // Update state with the new columns
      setCols(newCols);
    };

    return (
      <div className="w-full my-2 flex border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4 py-2 text-lg focus:outline-none dark:bg-gray-700 dark:text-gray-200">
        <div
          className="flex items-center px-4"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <FiList></FiList>
        </div>
        <div
          className=" "
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={(e) => onChangeHandle(e)}
          placeholder="Text"
        >
          {placeholder}
        </div>
      </div>
    );
  };
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="content">
          <div>CreateBlog</div>

          <div className="w-full flex flex-col items-center	">
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700">
              <textarea
                placeholder="Title"
                className="w-full h-full px-4 py-2 text-lg border-none focus:outline-none bg-transparent dark:text-gray-200 resize-none"
              />
            </div>

            <div className="flex">
              {Cols.map((col) => (
                <div className="w-20vw">
                  <Popover
                    content={
                      <div>
                        <span
                          className="circleButton"
                          onClick={(e) => handleInputChange(e, col.id)}
                        >
                          T
                        </span>
                      </div>
                    }
                    title="Add object"
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                  >
                    <div className="circleButton">
                      <FiPlusCircle></FiPlusCircle>
                    </div>
                  </Popover>

                  <Droppable droppableId={col.id.toString()}>
                    {(provided) => (
                      <>
                        {/* <InputText
                          onBlur={(e) => handleInputChange(e, col.id)}
                          placeholder={"Text"}
                        ></InputText> */}
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
                                {(provided) =>
                                  img.type === 1 ? (
                                    <InputText2
                                      id={img.id}
                                      placeholder={img.content}
                                      provided={provided}
                                    ></InputText2>
                                  ) : (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="w-20vw"
                                    >
                                      <div className="relative group m-4">
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
                                  )
                                }
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
                                <span class="font-semibold">
                                  Click to upload
                                </span>{" "}
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
        </div>
      </DragDropContext>
    </>
  );
}
