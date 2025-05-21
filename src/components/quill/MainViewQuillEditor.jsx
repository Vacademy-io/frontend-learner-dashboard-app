import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import katex from "katex";
import "katex/dist/katex.css";
window.katex = katex;

const ALL_OPERATORS = [
  { display: "sin", symbol: "sin" },
  { display: "cos", symbol: "\\cos" },
  { display: "tan", symbol: "\\tan" },
  { display: "log", symbol: "\\log" },
  { display: "sqrt", symbol: "\\sqrt{}" },
  { display: "+", symbol: "+" },
  { display: "-", symbol: "-" },
  { display: "×", symbol: "\\times" },
  { display: "÷", symbol: "\\div" },
  { display: "^", symbol: "^" },
  { display: "_", symbol: "_" },
];

export const MainViewQuillEditor = ({ value, onChange }) => {
  const reactQuillRef = useRef(null);
  const [showOperators, setShowOperators] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const quill = reactQuillRef.current?.getEditor();
    if (!quill) return;

    const toolbar = quill.getModule("toolbar");
    if (!toolbar) return;

    toolbar.addHandler("formula", () => {
      const range = quill.getSelection(true);
      if (!range) return;

      const toolbarElem = quill.container.previousSibling;
      if (!toolbarElem) {
        setShowOperators(true);
        return;
      }
      const formulaBtn = toolbarElem.querySelector("button.ql-formula");
      if (!formulaBtn) {
        setShowOperators(true);
        return;
      }
      const rect = formulaBtn.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      setPopupPosition({
        top: rect.bottom + scrollTop + 5,
        left: rect.left + scrollLeft,
      });

      setShowOperators((prev) => !prev);
    });
  }, []);

  const insertOperator = (symbol) => {
    const quill = reactQuillRef.current?.getEditor();
    if (!quill) return;
  
    const range = quill.getSelection(true);
    if (!range) return;
  
    // Insert the symbol as a formula embed
    quill.insertEmbed(range.index, 'formula', symbol);
    
    // Move cursor to right after the formula
    quill.setSelection(range.index + 1);
  
    setShowOperators(false);
    quill.focus();
  };
  

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["formula"],
      ],
    },
  };

  return (
    <>
      <ReactQuill
        ref={reactQuillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        preserveWhitespace
      />
      {showOperators && (
        <div
          style={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: 10,
            zIndex: 1000,
            maxHeight: 200,
            overflowY: "auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            fontFamily: "monospace",
            width: 180,
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: 8,
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
              userSelect: "none",
            }}
          >
            Operators
          </div>
          {ALL_OPERATORS.map(({ display, symbol }, i) => (
            <button
              key={i}
              type="button"
              onClick={() => insertOperator(symbol)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                marginBottom: 5,
                background: "#f9f9f9",
                border: "1px solid #ccc",
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: 3,
                fontFamily: "monospace",
              }}
              title={symbol}
            >
              {display}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowOperators(false)}
            style={{
              marginTop: 8,
              width: "100%",
              cursor: "pointer",
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: 3,
              padding: "6px 8px",
              fontWeight: "bold",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};
