import React, { useState } from 'react';
import { Digit, Operator } from './data';
import styles from './index.less';
import Display from './components/display';
import Pad from './components/pad';
import { Button, List, Typography } from 'antd';

interface CalculatorToolProps {}

const CalculatorTool: React.FC<CalculatorToolProps> = props => {
  // Calculator's states
  const [memory, setMemory] = useState<number>(0);
  const [result, setResult] = useState<number>(0);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(true);
  const [pendingOperator, setPendingOperator] = useState<Operator>();
  const [display, setDisplay] = useState<string>('0');
  const [logData, setLogData] = useState<string[]>([]);

  const calculate = (
    rightOperand: number,
    pendingOperator: Operator,
  ): boolean => {
    let newResult = result;

    switch (pendingOperator) {
      case '+':
        newResult += rightOperand;
        break;
      case '-':
        newResult -= rightOperand;
        break;
      case '×':
        newResult *= rightOperand;
        break;
      case '÷':
        if (rightOperand === 0) {
          return false;
        }

        newResult /= rightOperand;
    }
    setResult(newResult);
    setDisplay(
      newResult
        .toString()
        .toString()
        .slice(0, 12),
    );
    setLogData(
      [
        ...logData,
        `${result} ${pendingOperator} ${rightOperand} = ${newResult}`,
      ].reverse(),
    );

    return true;
  };

  const onBackOffClick = () => {
    if (waitingForOperand) return;
    const newDisplay =
      display.length > 1 ? display.slice(0, display.length - 1) : '0';
    setDisplay(newDisplay);
  };

  // pad buttons handlers
  const onDigitButtonClick = (digit: Digit) => {
    let newDisplay = display;

    if ((display === '0' && digit === 0) || display.length > 12) {
      return;
    }

    if (waitingForOperand) {
      newDisplay = '';
      setWaitingForOperand(false);
    }

    if (display !== '0') {
      newDisplay = newDisplay + digit.toString();
    } else {
      newDisplay = digit.toString();
    }

    setDisplay(newDisplay);
  };

  const onPointButtonClick = () => {
    let newDisplay = display;

    if (waitingForOperand) {
      newDisplay = '0';
    }

    if (newDisplay.indexOf('.') === -1) {
      newDisplay = newDisplay + '.';
    }

    setDisplay(newDisplay);
    setWaitingForOperand(false);
  };

  const onOperatorButtonClick = (operator: Operator) => {
    const operand = Number(display);

    if (typeof pendingOperator !== 'undefined' && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return;
      }
    } else {
      setResult(operand);
    }

    setPendingOperator(operator);
    setWaitingForOperand(true);
  };

  const onChangeSignButtonClick = () => {
    const value = Number(display);

    if (value > 0) {
      setDisplay('-' + display);
    } else if (value < 0) {
      setDisplay(display.slice(1));
    }
  };

  const onEqualButtonClick = () => {
    const operand = Number(display);
    if (typeof pendingOperator !== 'undefined' && !waitingForOperand) {
      if (!calculate(operand, pendingOperator)) {
        return;
      }

      setPendingOperator(undefined);
    } else {
      setDisplay(operand.toString());
    }

    setResult(operand);
    setWaitingForOperand(true);
  };

  const onAllClearButtonClick = () => {
    setMemory(0);
    setResult(0);
    setPendingOperator(undefined);
    setDisplay('0');
    setWaitingForOperand(true);
  };

  const onClearEntryButtonClick = () => {
    setDisplay('0');
    setWaitingForOperand(true);
  };

  const onMemoryRecallButtonClick = () => {
    setDisplay(memory.toString());
    setWaitingForOperand(true);
  };

  const onMemoryClearButtonClick = () => {
    setMemory(0);
    setWaitingForOperand(true);
  };

  const onMemoryPlusButtonClick = () => {
    setMemory(memory + Number(display));
    setWaitingForOperand(true);
  };

  const onMemoryMinusButtonClick = () => {
    setMemory(memory - Number(display));
    setWaitingForOperand(true);
  };

  const logHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Text strong>Result Log:</Typography.Text>
        <Button type={'primary'} onClick={() => setLogData([])}>
          Clear
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.left}>
        <Display
          value={display}
          hasMemory={memory !== 0}
          expression={
            typeof pendingOperator !== 'undefined'
              ? `${result}${pendingOperator}${waitingForOperand ? '' : display}`
              : ''
          }
        />
        <Pad
          onDigitButtonClick={onDigitButtonClick}
          onPointButtonClick={onPointButtonClick}
          onOperatorButtonClick={onOperatorButtonClick}
          onChangeSignButtonClick={onChangeSignButtonClick}
          onEqualButtonClick={onEqualButtonClick}
          onAllClearButtonClick={onAllClearButtonClick}
          onClearEntryButtonClick={onClearEntryButtonClick}
          onMemoryRecallButtonClick={onMemoryRecallButtonClick}
          onMemoryClearButtonClick={onMemoryClearButtonClick}
          onMemoryPlusButtonClick={onMemoryPlusButtonClick}
          onMemoryMinusButtonClick={onMemoryMinusButtonClick}
          onBackOffClick={onBackOffClick}
        />
      </div>
      <List
        header={logHeader()}
        bordered={false}
        dataSource={logData}
        renderItem={item => (
          <List.Item>
            <Typography.Text>{item}</Typography.Text>
          </List.Item>
        )}
        style={{ width: '45%', height: '100%', overflowY: 'auto' }}
      />
    </>
  );
};
export default CalculatorTool;
