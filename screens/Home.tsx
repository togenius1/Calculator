import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Calculator2 from '../Components/Calculator2';

type Props = {};

const Home = (props: Props) => {
  return <Calculator2 nextScreen="NextScreen" />;
};

export default Home;

const styles = StyleSheet.create({});
