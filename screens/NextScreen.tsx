import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {};

const NextScreen = ({route}: Props) => {
  console.log('next screen: ', route.params.passingValue);
  return (
    <View>
      <Text>Next Screen: {route.params.passingValue}</Text>
    </View>
  );
};

export default NextScreen;

const styles = StyleSheet.create({});
