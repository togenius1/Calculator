import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {currencyFormatter} from '../util/currencyFormatter';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const del = (
  <MaterialCommunityIcons name="backspace" size={35} color="#000000" />
);
const sigma = <MaterialCommunityIcons name="sigma" size={35} color="#000000" />;

const next = (
  <MaterialCommunityIcons name="chevron-right" size={40} color="#001780" />
);

const ops = ['/', '*', '-', '+'];

const Calculator2 = ({nextScreen}: Props) => {
  const [resultText, setResultText] = useState<string | null>('0');
  const [calculatedText, setCalculatedText] = useState<string | null>('0');
  const [sigmaPressed, setSigmaPressed] = useState<boolean>(false);
  const [equalPressed, setEqualPressed] = useState<boolean>(true);

  const nextOrEq = sigmaPressed ? '=' : next;

  const numeric = [
    '7',
    '8',
    '9',
    del,
    '4',
    '5',
    '6',
    'C',
    '1',
    '2',
    '3',
    sigma,
    '.',
    '0',
    '00',
    nextOrEq,
  ];

  const navigation = useNavigation();

  function validate() {
    const text = resultText;
    // console.log('Validate ', text.slice(-1));
    switch (text.slice(-1)) {
      case '+':
      case '-':
      case '*':
      case '/':
        return false;
    }
    return true;
  }

  function calculateResult() {
    const text = resultText; //now parse this text, ex- 3+3*6^5/2+7
    if (eval(text) === undefined) {
      setCalculatedText('0');
      return;
    }
    setCalculatedText(eval(text));
  }

  function clearScreen() {
    setResultText('');
    setCalculatedText('');
    setSigmaPressed(false);
    setEqualPressed(true);
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
      if (sigmaPressed === true) {
        setResultText('0');
        setCalculatedText('0');
      }
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
    if (text !== '=' && text !== sigma && !sigmaPressed) {
      const serialText = resultText + text;
      const result = serialText.replace(/^0+/, '');

      console.log('Sigma first pressed:----->  ', result);
      setResultText(result);
    }
    if (text !== '=' && text !== sigma && sigmaPressed) {
      const serialText = resultText + text;
      const result = serialText.replace(/^0+/, '');
      // cut object out

      console.log('Sigma Second pressed:----->  ', result);
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
        if (ops.indexOf(lastChar) > 0) {
          return;
        }
        if (resultText === '') {
          return;
        }
        // check if pressed ops > one time
        if (
          resultText[resultText.length - 1] === '+' ||
          resultText[resultText.length - 1] === '-' ||
          resultText[resultText.length - 1] === '*' ||
          resultText[resultText.length - 1] === '/'
        ) {
          return;
        }
        setResultText(resultText + operation);
        break;
    }
  }

  //   Navigator
  function gotoNextScreen() {
    navigation.navigate(nextScreen, {});
    clearScreen();
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

      {sigmaPressed && (
        <View style={styles.opsContainer}>
          {ops.map(value => (
            <Pressable
              key={value + Math.random()}
              onPress={() => operate(value)}
              style={({pressed}) => pressed && styles.pressed}>
              <Text style={styles.opsText}>{value}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <NumericLayout values={numeric} setSelectedValue={buttonPressed} />
    </View>
  );
};

const NumericLayout = ({values, setSelectedValue}) => (
  <View style={styles.container}>
    <View style={styles.numericRow}>
      {values.map(value => (
        <Pressable
          key={value + Math.random()}
          onPress={() => setSelectedValue(value)}
          style={({pressed}) => [styles.button, pressed && styles.pressed]}>
          <Text style={[styles.buttonLabel]}>{value}</Text>
        </Pressable>
      ))}
    </View>
  </View>
);

const btnContainerHeight = windowHeight / 3;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    position: 'absolute',
    bottom: windowHeight / 4,
  },
  numericRow: {
    flex: 1,
    height: windowHeight / 12,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  opsContainer: {
    width: windowWidth / 1.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    position: 'absolute',
    bottom: btnContainerHeight + 10,
    left: 35,
  },
  opsText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth / 4,
    height: '100%',
    backgroundColor: '#0075b0ff',
    borderWidth: 0.6,
    borderColor: 'lightgrey',

    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  currencyContainer: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90b9ff',
    hadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 3,

    position: 'absolute',
    right: 15,
    top: 20,
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
  operationsContainer: {
    width: windowWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',

    position: 'absolute',
    bottom: btnContainerHeight + 20,
    left: 35,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default Calculator2;
