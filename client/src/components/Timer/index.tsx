import React from "react";
import InfoBox from "../ui/infoBox";
import { connect } from "react-redux";
import { StateStore } from "../../redux/reducers/index";
import { formatSeconds } from "./../../util/index";
import { TimerStateType } from "../../redux/reducers/timer/timerReducer";
import { stopTimer } from "../../redux/actions";

export interface TimerProps extends TimerStateType {
  stopTimer: typeof stopTimer;
}

class Timer extends React.Component<TimerProps> {
  interval: any;
  baseTime = 1800000; // 30 * 60 * 1000 = 30 min

  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getElapsedTime = () => {
    const { startedAt, stoppedAt = new Date().getTime() } = this.props;
    return startedAt ? Math.round((this.baseTime - (stoppedAt - startedAt)) / 1000) : 0;
  };

  renderFormattedTime = (timer: number) => (timer <= 0 ? "۰۰:۰۰" : formatSeconds(timer));

  render() {
    const elapsed = this.getElapsedTime();
    const { startedAt, stoppedAt, stopTimer } = this.props;
    if (elapsed <= 0 && stoppedAt === undefined && startedAt !== undefined) {
      stopTimer();
    }

    return (
      <InfoBox classNm="container mb-5 remaining-time-box" textStyle="p-3">
        <React.Fragment>
          <span>زمان باقی‌مانده: </span>
          <span style={{ display: "inline-block", width: "4rem" }}>
            {this.renderFormattedTime(elapsed)}
          </span>
        </React.Fragment>
      </InfoBox>
    );
  }
}

function mapStateToProps({ timer: { startedAt, stoppedAt } }: StateStore) {
  return { startedAt, stoppedAt };
}

export default connect(mapStateToProps, { stopTimer })(Timer);
