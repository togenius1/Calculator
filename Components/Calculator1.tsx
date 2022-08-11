import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {currencyFormatter} from '../util/currencyFormatter';

type Props = {
  nextScreen: string;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Calculator = ({nextScreen}: Props) => {
  const [resultText, setResultText] = useState('');
  const [calculatedText, setCalculatedText] = useState('0');
  const [sigmaPressed, setSigmaPressed] = useState(false);
  const [equalPressed, setEqualPressed] = useState(true);

  const navigation = useNavigation();

  // console.log(resultText);

  function calculateResult() {
    const text = resultText; //now parse this text, ex- 3+3*6^5/2+7
    if (eval(text) === undefined) {
      setCalculatedText('0');
      return;
    }
    setCalculatedText(eval(text));

    // setSigmaPressed(false);
    // setEqualPressed(true);
  }

  function clearScreen() {
    setResultText('');
    setCalculatedText('');
    setSigmaPressed(false);
    setEqualPressed(true);
  }

  function validate() {
    const text = resultText;
    switch (text.slice(-1)) {
      case '+':
      case '-':
      case '*':
      case '/':
        return false;
    }
    return true;
  }

  function buttonPressed(text) {
    if (text === del) {
      operate('del');
      return;
    }
    if (text === 'C') {
      operate('C');
      return;
    }
    if (text === sigma) {
      operate('sigma');
      return;
    }
    if (text === next) {
      operate('next');
      return;
    }
    if (text === '=') {
      operate('sigma');
      operate('equalPressed');
      return validate() && calculateResult();
    }
    if (text !== '=' && !sigmaPressed) {
      const serialText = resultText + text;
      const result = serialText.replace(/^0+/, '');
      setResultText(result);
    }
    if (text !== '=' && sigmaPressed) {
      const serialText = resultText + text;
      const result = serialText.replace(/^0+/, '');
      setResultText(result);
    }
  }

  function operate(operation: string) {
    switch (operation) {
      case '0':
        setCalculatedText(0);
        break;
      case 'del':
        const text = resultText.split('');
        text.pop();
        setResultText(text.join(''));
        break;
      case 'C':
        clearScreen();
        break;
      case 'sigma':
        setSigmaPressed(!sigmaPressed);
        setEqualPressed(true);
        break;
      case 'equalPressed':
        setEqualPressed(false);
        setSigmaPressed(false);
        break;
      case 'next':
        gotoNextScreen();
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        const lastChar = resultText.split('').pop();
        if (operations.indexOf(lastChar) > 0) return;
        if (resultText === '') return;
        setResultText(resultText + operation);
        break;
    }
  }

  // Navigator
  function gotoNextScreen() {
    navigation.navigate(nextScreen, {});
  }

  const del = (
    <MaterialCommunityIcons name="backspace" size={35} color="#000000" />
  );
  const sigma = (
    <MaterialCommunityIcons name="sigma" size={35} color="#000000" />
  );

  const next = (
    <MaterialCommunityIcons name="chevron-right" size={40} color="#082ccf" />
  );

  const nextOrEqual = sigmaPressed ? '=' : next;

  let rows = [];
  let nums = [
    [7, 8, 9, del],
    [4, 5, 6, 'C'],
    [1, 2, 3, sigma],
    ['.', 0, '00', nextOrEqual],
  ];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(
        <Pressable
          key={nums[i][j].toString()}
          onPress={() => buttonPressed(nums[i][j])}
          style={({pressed}) => (pressed && styles.pressed) || styles.btn}>
          <View style={styles.btnNumContainer}>
            <Text style={styles.btnText}>{nums[i][j]}</Text>
          </View>
        </Pressable>,
      );
    }
    rows.push(
      <View key={i.toString()} style={styles.row}>
        {row}
      </View>,
    );
  }

  let ops = [];
  let operations = ['/', '*', '-', '+'];
  for (let i = 0; i < 7; i++) {
    ops.push(
      <Pressable
        key={i.toString()}
        onPress={() => operate(operations[i])}
        style={({pressed}) => pressed && styles.pressedOps}>
        <Text style={styles.opsText}>{operations[i]}</Text>
      </Pressable>,
    );
  }

  return (
    <View style={{flex: 1}}>
      <Pressable
        onPress={() => {}}
        style={({pressed}) => pressed && styles.pressed}>
        <View style={styles.currencyContainer}>
          <MaterialCommunityIcons
            name="currency-usd"
            size={22}
            color="#082ccf"
          />
        </View>
      </Pressable>
      {(sigmaPressed || !equalPressed) && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{resultText}</Text>
        </View>
      )}
      <View style={styles.calculatedContainer}>
        {sigmaPressed || !equalPressed ? (
          <Text style={styles.calculatedText}>
            {currencyFormatter(+calculatedText, {
              symbol: '',
              significantDigits: 0,
            })}
          </Text>
        ) : (
          <Text style={styles.calculatedText}>
            {currencyFormatter(+resultText, {
              symbol: '',
              significantDigits: 0,
            })}
          </Text>
        )}
      </View>
      {sigmaPressed && <View style={styles.operationsContainer}>{ops}</View>}
      <View style={styles.btnContainer}>
        <View style={styles.buttons}>
          <View style={styles.numbers}>{rows}</View>
        </View>
      </View>
    </View>
  );
};

export default Calculator;

const btnContainerHeight = windowHeight / 3;

const styles = StyleSheet.create({
  btnContainer: {
    width: windowWidth,
    height: btnContainerHeight,

    position: 'absolute',
    bottom: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
  },
  btnNumContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderColor: 'lightgrey',
    borderWidth: 0.2,
    backgroundColor: '#5b8098',
    borderRadius: 2,

    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  btnOpsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderColor: 'lightgrey',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  btnText: {
    fontSize: 25,
  },
  calculatedContainer: {
    alignItems: 'flex-end',

    position: 'absolute',
    bottom: btnContainerHeight + 80,
    right: 30,
  },
  calculatedText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: windowWidth,
    alignItems: 'flex-start',

    position: 'absolute',
    top: 100,
    left: 25,
  },
  resultText: {
    fontSize: 22,
  },

  buttons: {
    flex: 7,
    flexDirection: 'row',
  },
  numbers: {
    flex: 3,
    // backgroundColor: '#90dcef',
    borderColor: 'grey',
    borderWidth: 1,
  },
  operationsContainer: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',

    position: 'absolute',
    bottom: btnContainerHeight + 20,
    left: 35,
  },
  opsText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    right: 15,
    bottom: btnContainerHeight,
  },
  clearContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    right: 100,
    bottom: btnContainerHeight + 12,
  },
  clearText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1368fac2',
  },
  next: {
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    right: 15,
    bottom: 0,
  },
  currencyContainer: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90b9ff',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 15,
    top: 20,
  },
  pressed: {
    flex: 1,
    opacity: 0.75,
  },
  pressedOps: {
    opacity: 0.35,
  },
});
