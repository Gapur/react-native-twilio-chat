import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const ChatListLoader = () => {
  return (
    <SkeletonPlaceholder speed={1800}>
      <View style={styles.container}>
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
        <View style={styles.item} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  item: {
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
});
