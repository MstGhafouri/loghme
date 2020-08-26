import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { handleModals } from "../../redux/actions";

export interface PopupProps {
  handleModals: typeof handleModals;
  children: JSX.Element | JSX.Element[];
  open: boolean;
  name: string;
  overLayClassNm?: string;
  contentClassNm?: string;
}

class Popup extends React.Component<PopupProps> {
  private wrapperStyle: React.CSSProperties = {
    visibility: "hidden",
    opacity: 0
  };

  private contentStyle: React.CSSProperties = {
    transform: "scale(0.3, 0.3)",
    opacity: 0
  };

  onClose = () => {
    const { handleModals, name } = this.props;
    handleModals(false, name);
  };

  renderModal = () => {
    const { open, contentClassNm, overLayClassNm } = this.props;
    // console.log(this.props.name, open);
    if (open) {
      this.contentStyle = { opacity: 1, transform: "scale(1, 1)" };
      this.wrapperStyle = { visibility: "visible", opacity: 1 };
    } else {
      this.contentStyle = { opacity: 0, transform: "scale(0.3, 0.3)" };
      this.wrapperStyle = { visibility: "hidden", opacity: 0 };
    }

    return (
      <div className={`popup ${overLayClassNm}`} style={this.wrapperStyle} onClick={this.onClose}>
        <div
          className={`popup__content ${contentClassNm}`}
          style={this.contentStyle}
          onClick={e => e.stopPropagation()}
        >
          <button className="popup__close" onClick={this.onClose}>
            &times;
          </button>
          {this.props.children}
        </div>
      </div>
    );
  };

  render() {
    return ReactDOM.createPortal(this.renderModal(), document.getElementById("modals")!);
  }
}

export default connect(null, { handleModals })(Popup);
