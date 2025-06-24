import React, { useEffect, useRef, useState } from "react";
import Upload from "../imageView/Upload";
import { Popover } from "antd";
import { FiImage, FiList, FiPlusCircle } from "react-icons/fi";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Item from "antd/es/list/Item";
import debounce from "lodash.debounce";
import { v4 as uuidv4 } from "uuid";

export default function ColumnBlog({Cols,setCols,col}) {
  const handleSetImage = (e, cols, item) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      updateColsFunction({col:cols.id,id:item.id,content:url,type:2})
    }
  };
  const handleInputChange = (colIndex, type) => {
    // const newContent = e.target.innerText;

    const newCols = Cols.map((data) => {
      if (data.id === colIndex) {
        return {
          ...data,
          items: [
            ...data.items,
            { content: "", type: type, id: uuidv4(), hidden: true },
          ],
        };
      }
      return data;
    });
    // setIsInputText(false);
    setCols(newCols);
  };



  const handleDragEnd = (e) => {
    const { destination, source, draggableId } = e;
    try {
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

      const startCol = Cols.find(
        (col) => col.id === Number(source.droppableId)
      );
      const finishCol = Cols.find(
        (col) => col.id === Number(destination.droppableId)
      );
      if (!startCol || !finishCol) return;
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

  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(!open);
  };
  const updateColsFunction=(updateItem)=>
    {
      const updatedCols = Cols.map((col) => {
        if (col.id === updateItem.col) {
          // Nếu đúng cột, cập nhật items
          const updatedItems = col.items.map((item) =>
            item.id === updateItem.id
              ? { ...item, ...updateItem } // Cập nhật nội dung mới
              : item
          );
          return { ...col, items: updatedItems }; // Trả về col với items đã được cập nhật
        }
        return col; // Các col khác giữ nguyên
      });
    
      setCols(updatedCols)
    }
  const InputText2 = ({
    onBlur,
    placeholder,
    provided,
    id,
    hidden,
    col,
    snapshot,
    index,
  }) => {
    return (
      <div
        className="flex z-10 w-full "
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div
          className={`flex items-center px-4 ${
            snapshot.isDragging ? `after:content-['${placeholder}']` : ""
          }`}
        >
          <Popover
            trigger={"click"}
            content={
              <div>
                <ul>
                  <li onClick={()=>updateColsFunction({col:col.id,id:id,content:'',type:2})} className="p-4">
                    Change to img
                  </li>
                  <li className="p-4">Change to text</li>
                </ul>
              </div>
            }
          >
            <FiList></FiList>
          </Popover>
        </div>
        <div className={`w-full flex focus:outline-none py-4 hover:cursor-text	`}>
          <div
            ref={index === col.items.length - 1 ? lastItemRef : null}
            className="w-full"
            onBlur={(e) => updateColsFunction({col:col.id,id:id,content:e.target.innerText,type:1})}
            contentEditable
            suppressContentEditableWarning={true}
            placeholder="Text"
          >
            {placeholder}
          </div>
        </div>
      </div>
    );
  };

  const InputImg = ({ item, col }) => {
    return (
      <div class="flex items-center justify-center w-full">
        <label
          for={item.id}
          class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <FiImage size={20} className="m-4"></FiImage>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id={item.id}
            onChange={(e) => handleSetImage(e, col, item)}
            type="file"
            class="hidden"
          />
        </label>
      </div>
    );
  };
  const handleAddColumnElement = (index) => {
    const newCols = Cols.map((col) =>
      col.id === index
        ? { ...col, items: [...col.items] } // Tạo bản sao sâu cho `items`
        : col
    );
    const colsIndex = newCols.find((e) => e.id === index);
    if (colsIndex.items.length === 0) {
      handleInputChange(index, 1);
    } else if (
      colsIndex.items[colsIndex.items.length - 1].content.length > 0 &&
      colsIndex.items.length >= 1
    ) {
      handleInputChange(index, 1);
    } else if (
      colsIndex.items.length >= 2 &&
      colsIndex.items[colsIndex.items.length - 2].content.length === 0 &&
      colsIndex.items[colsIndex.items.length - 1].content.length === 0
    ) {
      colsIndex.items.splice(colsIndex.items.length - 1, 1);
      setCols(newCols);
    } else {
      if (lastItemRef.current) {
        lastItemRef.current.focus();
      }
    }
  };
  const lastItemRef = useRef(null);
  const BORDER_SIZE = 4;
  const panelRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  let YPos = 0;
  let initPos = 0;

  const handleMouseDown = (e) => {
    if (!panelRef.current) return;

    YPos = e.offsetX;
    setIsDragging(true);

    const resizeElement = panelRef.current;
    initPos = parseInt(resizeElement.style.width, 10) || 
              parseInt(window.getComputedStyle(resizeElement).width, 10);

   console.log("Mouse Down - initPos:", initPos, "YPos:", YPos);
  };

  const handleMouseMove = (e) => {
    if (!panelRef.current || !isDragging) return;

    const newWidth =  e.offsetX;
    if (newWidth > 50) {
      panelRef.current.style.width = newWidth + "px";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
    <div className="flex h-full justify-between " style={{width:'200px'}} ref={panelRef}>
    <div
      className="flex flex-col"
      style={{ width: 100 / Cols.length + "%" }}
    >
      <div className="relative">
        <div className="w-full">
          <Popover
            content={
              <div >
                <div 
                className="flex-col w-full rounded-md hover:bg-sky-700 "
                  onClick={(e) => handleInputChange(e, col.id, 1)}
                >
                  Add text field
                </div>
                <div className="w-full rounded-md hover:bg-sky-700"
                  onClick={(e) => handleInputChange(e, col.id, 2)}
                >
                  Add image field
                  </div>
              </div>
            }
            title="Add"
            trigger="click"
            open={open}
            onOpenChange={()=>handleOpenChange(col)}
          >
            <div className="circleButton">
              <FiPlusCircle></FiPlusCircle>
            </div>
          </Popover>

          <Droppable droppableId={col.id.toString()}>
            {(provided, snapshot) => (
              <>
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="relative  z-10"
                >
                  {col.items &&
                    col.items.map((img, index) => (
                      <Draggable
                        key={img.id}
                        draggableId={img.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => {
                          return (
                            <>
                              {img.type === 1 && (
                                <InputText2
                                  hidden={img.hidden}
                                  id={img.id}
                                  snapshot={snapshot}
                                  col={col}
                                  index={index}
                                  placeholder={img.content}
                                  provided={provided}
                                />
                              )}
                              {img.type === 2 &&
                                (img.content ? (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="w-full"
                                  >
                                    <div className="relative group m-4">
                                      <span className="circleButton absolute top-8 right-12 hidden group-hover:flex cursor-pointer">
                                        X
                                      </span>
                                      <img
                                        src={img.content}
                                        alt="BlogImage"
                                        className="w-full py-2 h-30vh object-cover hover:cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <InputImg
                                    item={img}
                                    col={col}
                                  ></InputImg>
                                ))}
                            </>
                          );
                        }}
                      </Draggable>
                    ))}
                  {provided.placeholder}{" "}
                  {/* Đây là placeholder cho Droppable */}
                </div>
              </>
            )}
          </Droppable>
        </div>
        {/* <div
        className="w-full h-20 justify-center border-2 opacity-0	 border-transparent rounded-lg cursor-pointer bg-gray-50 
        hover:border-gray-400 hover:border-dashed hover:shadow-lg 
        dark:bg-gray-200 hover:opacity-100	 dark:hover:border-gray-600  transition-all duration-300"
      onClick={(e) => handleInputChange(e, col.id, 1)}
    >Write something</div> */}
      </div>
      <div
        className="h-full w-full"
        onClick={() => handleAddColumnElement(col.id)}
      ></div>
    </div>
    <div className="h-48 w-8 relative ">
    <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100vw",
          height: "100vh",
          cursor: "ew-resize",
        }}
        onMouseDown={handleMouseDown}
        className="absolute top-0 bottom-0 left-[21px] w-[4px] h-full bg-[rgba(55,53,47,0.16)]"
      ></div>
    </div>
  
  </div>  
 
  </>
)
}

