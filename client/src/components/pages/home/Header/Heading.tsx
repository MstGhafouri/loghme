import React from "react";

export interface HeadingProps {
  letters: string;
}

const Heading: React.SFC<HeadingProps> = props => {
  return (
    <ul className="header__text">
      {props.letters.split(" ").map((item, i) => (
        <li className="header__text--letter" key={i}>
          {item}
        </li>
      ))}
    </ul>
  );
};

export default Heading;
