import React, { useRef, useState, useEffect } from "react";
import { GoListOrdered, GoListUnordered } from "react-icons/go";

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  const applyFormatTag = (tag) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const selectedContent = range.extractContents();

    const el = document.createElement(tag);
    el.appendChild(selectedContent);

    range.insertNode(el);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(el);
    selection.addRange(newRange);

    editorRef.current.focus();
    triggerChange();
  };

  // Replace format function with manual tag wrapping for text styles
  const format = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    switch (command) {
      case "bold":
        applyFormatTag("strong");
        break;
      case "italic":
        applyFormatTag("em");
        break;
      case "underline":
        applyFormatTag("u");
        break;
      case "insertOrderedList":
        toggleList("ol");
        break;
      case "insertUnorderedList":
        toggleList("ul");
        break;
      default:
        break;
    }
  };

  const toggleList = (listType) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    let startContainer = range.startContainer;
    while (
      startContainer &&
      startContainer !== editorRef.current &&
      startContainer.nodeType !== 1
    ) {
      startContainer = startContainer.parentNode;
    }

    let currentList = findClosestParent(startContainer, listType);
    if (currentList) {
      const parent = currentList.parentNode;
      while (currentList.firstChild) {
        parent.insertBefore(currentList.firstChild, currentList);
      }
      parent.removeChild(currentList);
      onChange(editorRef.current.innerHTML);
      return;
    }

    const selectedText = selection.toString();
    if (!selectedText) {
      const list = document.createElement(listType);
      const li = document.createElement("li");
      li.innerHTML = "<br>";
      list.appendChild(li);
      range.deleteContents();
      range.insertNode(list);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(li);
      newRange.collapse(true);
      selection.addRange(newRange);
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
      return;
    }

    const list = document.createElement(listType);
    const lines = selectedText.split("\n").filter(Boolean);
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      list.appendChild(li);
    });

    range.deleteContents();
    range.insertNode(list);
    selection.removeAllRanges();
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  const findClosestParent = (el, tagName) => {
    while (el && el !== editorRef.current) {
      if (el.nodeType === 1 && el.tagName.toLowerCase() === tagName) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  };

  // Insert code block same as before
  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const codeBlock = document.createElement("pre");
    codeBlock.className =
      "bg-gray-100 p-3 rounded font-mono text-sm whitespace-pre-wrap";
    codeBlock.textContent = selection.toString();
    range.deleteContents();
    range.insertNode(codeBlock);
    selection.removeAllRanges();
    editorRef.current.focus();
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <>
      <div className="flex bg-stone-100 rounded-t-xl">
        <button
          type="button"
          onClick={() => format("bold")}
          className="px-4 py-2 font-bold hover:bg-gray-200 hover:rounded-tl-xl"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => format("italic")}
          className="px-4 py-2 italic hover:bg-gray-200"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => format("underline")}
          className="px-4 py-2 underline hover:bg-gray-200"
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => format("insertOrderedList")}
          className="px-4 py-2 rounded hover:bg-gray-200"
          title="Ordered List"
        >
          <GoListOrdered />
        </button>
        <button
          type="button"
          onClick={() => format("insertUnorderedList")}
          className="px-4 py-2 hover:bg-gray-200"
          title="Unordered List"
        >
          <GoListUnordered />
        </button>
        <button
          type="button"
          onClick={insertCodeBlock}
          className="px-4 py-2 hover:bg-gray-200 font-mono text-sm"
          title="Insert Code Block"
        >
          {"</>"}
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        tabIndex={0}
        className="min-h-[200px] border border-gray-300 rounded p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans text-gray-800 whitespace-pre-wrap"
        onInput={triggerChange}
        role="textbox"
        aria-multiline="true"
      ></div>
    </>
  );
};

export default RichTextEditor;