import React, { Component } from "react";
import Bar from "./components/Bar";
import Form from "./components/Form";

// Algorithms
import BubbleSort from "./algorithms/BubbleSort";
import MergeSort from "./algorithms/MergeSort";
import QuickSort from "./algorithms/QuickSort";
import InsertionSort from "./algorithms/InsertionSort";
import SelectionSort from "./algorithms/SelectionSort";

// Icons
import Play from "@mui/icons-material/PlayCircleOutlineRounded";
import Forward from "@mui/icons-material/SkipNextRounded";
import Backward from "@mui/icons-material/SkipPreviousRounded";
import Pause from "@mui/icons-material/PauseCircleOutline";
import RotateLeft from "@mui/icons-material/RotateLeft";

// Styles
import "./styles/RiseUpText.css";
import { riseText } from "./styles/RiseUpText";
import "./App.css";

class App extends Component {
  state = {
    array: [],
    arraySteps: [],
    colorKey: [],
    colorSteps: [],
    timeouts: [],
    currentStep: 0,
    barCount: 10,
    delay: 300,
    algorithm: "Bubble Sort",
    isPlaying: false, // Added state to track play/pause status
  };

  ALGORITHMS = {
    "Bubble Sort": BubbleSort,
    "Merge Sort": MergeSort,
    "Quick Sort": QuickSort,
    "Insertion Sort": InsertionSort,
    "Selection Sort": SelectionSort,
  };

  componentDidMount() {
    window.addEventListener("load", riseText);
    this.generateBars();
  }

  setTimeouts = () => {
    let steps = this.state.arraySteps;
    let colorSteps = this.state.colorSteps;

    this.clearTimeouts(); // Clear previous timeouts
    let timeouts = [];

    for (let i = 0; i < steps.length - this.state.currentStep; i++) {
      let timeout = setTimeout(() => {
        let currentStep = this.state.currentStep;
        this.setState({
          array: steps[currentStep],
          colorKey: colorSteps[currentStep],
          currentStep: currentStep + 1,
        });
      }, this.state.delay * i);
      timeouts.push(timeout);
    }

    this.setState({
      timeouts: timeouts,
    });
  };

  togglePlayPause = () => {
    if (this.state.isPlaying) {
      // If currently playing, pause
      this.clearTimeouts();
      this.setState({ isPlaying: false });
    } else {
      // If currently paused, resume
      this.setTimeouts();
      this.setState({ isPlaying: true });
    }
  };

  clearTimeouts = () => {
    this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.setState({ timeouts: [] });
  };

  clearColorKey = () => {
    let blankKey = new Array(this.state.barCount).fill(0);
    this.setState({ colorKey: blankKey, colorSteps: [blankKey] });
  };

  stepBack = () => {
    let currentStep = this.state.currentStep;

    if (currentStep === 0) return;
    this.clearTimeouts();
    currentStep -= 1;
    this.setState({
      array: this.state.arraySteps[currentStep],
      colorKey: this.state.colorSteps[currentStep],
      currentStep: currentStep,
    });
  };

  stepForward = () => {
    let currentStep = this.state.currentStep;

    if (currentStep >= this.state.arraySteps.length - 1) return;
    this.clearTimeouts();
    currentStep += 1;
    this.setState({
      array: this.state.arraySteps[currentStep],
      colorKey: this.state.colorSteps[currentStep],
      currentStep: currentStep,
    });
  };

  generateSteps = () => {
    let array = this.state.array.slice();
    let steps = this.state.arraySteps.slice();
    let colorSteps = this.state.colorSteps.slice();

    this.ALGORITHMS[this.state.algorithm](array, 0, steps, colorSteps);

    this.setState({
      arraySteps: steps,
      colorSteps: colorSteps,
    });
  };

  generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  generateBars = () => {
    this.clearTimeouts();
    this.clearColorKey();

    let barCount = this.state.barCount;
    let arr = [];

    for (let i = 0; i < barCount; i++) {
      arr.push(this.generateRandomNumber(50, 200));
    }

    this.setState(
      {
        array: arr,
        arraySteps: [arr],
        barCount: barCount,
        currentStep: 0,
      },
      () => this.generateSteps()
    );
  };

  changeArray = (index, value) => {
    let array = this.state.array;
    array[index] = value;
    console.log(array);
    this.setState(
      {
        array: array,
        arraySteps: [array],
        currentStep: 0,
      },
      () => this.generateSteps()
    );
  };

  changeBarCount = (e) => {
    this.clearTimeouts();
    this.clearColorKey();
    this.setState(
      {
        barCount: parseInt(e.target.value),
      },
      () => this.generateBars()
    );
  };

  changeSpeed = (e) => {
    this.clearTimeouts();
    this.setState({
      delay: parseInt(e.target.value),
    });
  };

  render() {
    let barsDiv = this.state.array.map((value, index) => (
      <Bar
        key={index}
        index={index}
        length={value}
        color={this.state.colorKey[index]}
        changeArray={this.changeArray}
      />
    ));
    let playButton;

    if (this.state.arraySteps.length === this.state.currentStep) {
      playButton = (
        <button className="controller" onClick={this.generateBars}>
          <RotateLeft />
        </button>
      );
    } else {
      playButton = (
        <button className="controller" onClick={this.togglePlayPause}>
          {this.state.isPlaying ? <Pause /> : <Play />}
        </button>
      );
    }

    return (
      <div className="app">
        <h1 className="page-header_title risetext">
          <span className="page-header_title-main enclose">
            Sorting Visualizer
          </span>
        </h1>

        <div className="frame">
          <div className="barsDiv container card">{barsDiv}</div>
        </div>

        <div className="control-pannel">
          <div className="control-buttons">
            <button className="controller" onClick={this.stepBack}>
              <Backward />
            </button>
            {playButton}
            <button className="controller" onClick={this.stepForward}>
              <Forward />
            </button>
          </div>
        </div>

        <div className="pannel">
          <Form
            formLabel="Algorithms"
            values={[
              "Bubble Sort",
              "Merge Sort",
              "Quick Sort",
              "Insertion Sort",
              "Selection Sort",
            ]}
            labels={[
              "Bubble Sort",
              "Merge Sort",
              "Quick Sort",
              "Insertion Sort",
              "Selection Sort",
            ]}
            currentValue={this.state.algorithm}
            onChange={this.changeAlgorithm}
          />
          <Form
            formLabel="Items"
            values={[10, 15, 20, 25, 30]}
            labels={[10, 15, 20, 25, 30]}
            currentValue={this.state.barCount}
            onChange={this.changeBarCount}
          />
          <Form
            formLabel="Speed"
            values={[500, 400, 300, 200, 100]}
            labels={["1x", "2x", "3x", "4x", "5x"]}
            currentValue={this.state.delay}
            onChange={this.changeSpeed}
          />
        </div>
      </div>
    );
  }
}

export default App;
