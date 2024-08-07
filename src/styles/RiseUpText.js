import React from "react";
import ReactDOM from "react-dom";

export const riseText = () => {
  const risetext = document.querySelector(".risetext");
  if (!risetext) {
    console.error('Element with class "risetext" not found.');
    return;
  }

  const enclose = document.querySelector(".page-header_title-main");
  if (!enclose) {
    console.error('Element with class "page-header_title-main" not found.');
    return;
  }

  const encloseText = Array.from(enclose.innerText.split(""));
  const string = encloseText
    .map((x, i) => {
      if (x === " ") {
        return (
          <>
            <span className="letter">&nbsp;</span>
            <span className="word"></span>
          </>
        );
      } else {
        return (
          <span className="letter" key={i}>
            {x}
          </span>
        );
      }
    })
    .reduce((acc, curr) => [acc, curr], []);

  const letters = Array.from(document.querySelectorAll(".letter"));

  letters.forEach((letter, i) => {
    letter.style.transitionDelay = `${50 * i}ms`;
  });

  // Only set up the class toggle for animation once
  if (!risetext.classList.contains("show")) {
    risetext.classList.add("show");
  }

  // Render JSX into the element
  ReactDOM.render(<div className="word">{string}</div>, enclose);
};
