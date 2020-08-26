import React from "react";
import Slider from "react-slick";

export interface CarouselProps {
  children: JSX.Element[] | JSX.Element;
  length: number;
}

export interface CarouselState {
  slidesToShow: number;
}

class Carousel extends React.Component<CarouselProps, CarouselState> {
  static defaultProps = {
    children: [],
    length: 0
  };

  private width = window.innerWidth;

  private configSlidesToShow = (width: number): number => {
    if (width <= 480) return 1;
    if (width <= 600) return 2;
    if (width <= 1024) return 3;
    if (width <= 1350) return 4;
    return 5;
  };

  state = {
    slidesToShow: this.configSlidesToShow(this.width)
  };

  private setting = {
    dots: true,
    infinite: true,
    pauseOnHover: true,
    speed: 1500,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    slidesToShow: this.state.slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  handleResize = (e: Event) => {
    if (window.innerWidth !== this.width) {
      this.width = window.innerWidth;
      if (this.width <= 480) {
        this.setState({ slidesToShow: 1 });
      } else if (this.width <= 600) {
        this.setState({ slidesToShow: 2 });
      } else if (this.width <= 1024) {
        this.setState({ slidesToShow: 3 });
      } else if (this.width <= 1350) {
        this.setState({ slidesToShow: 4 });
      } else this.setState({ slidesToShow: 5 });
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  private renderItems = () => {
    return (this.props.children as JSX.Element[]).map((item, i) => {
      return <React.Fragment key={i}>{item}</React.Fragment>;
    });
  };

  private fillHoles = () => {
    const { length } = this.props;
    if (length < this.state.slidesToShow) {
      return Array.from(Array(this.state.slidesToShow - length)).map((temp, i) => {
        return (
          <p key={i} className="dummy-element">
            &nbsp;
          </p>
        );
      });
    }
    return null;
  };

  render() {
    this.setting.slidesToShow = this.state.slidesToShow;
    return (
      <div>
        <Slider {...this.setting}>
          {this.fillHoles()}
          {this.renderItems()}
        </Slider>
      </div>
    );
  }
}

export default Carousel;
