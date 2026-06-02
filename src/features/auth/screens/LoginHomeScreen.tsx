import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = () => {
    navigation.navigate('EmailLogin');
  };

  const handleGoogle = () =>
    Alert.alert(
      "Coming Soon",
      "Google Login will be supported in the next version."
    );

  const handleApple = () =>
    Alert.alert(
      "Coming Soon",
      "Apple Login will be supported in the next version."
    );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.emailBtn]}
            onPress={handleEmailLogin}
          >
             <MaterialIcons name="email" size={24} color="#333" style={styles.icon} />
            <Text style={styles.emailText}>Continue with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.appleBtn]}
            onPress={handleApple}
          >
            <AntDesign name="apple" size={26} color="#fff" style={styles.icon} />
            <Text style={styles.appleText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.googleBtn]}
            onPress={handleGoogle}
          >
            <AntDesign name="google" size={24} color="#333" style={styles.icon} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            by continuing, you agree with Bloomind's{'\n'}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, justifyContent: 'space-between' },
    logo: {
    width: 360,
    height: 360,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40,
  },

  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    marginTop: 'auto',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 8,
  },
  button: {
    width: '100%',
    height: 58,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  icon: { width: 22,  marginRight: 16, resizeMode: 'contain' },

  emailBtn: { backgroundColor: '#F2F0DE' },
  emailText: { fontSize: 17, fontWeight: '600', color: '#333' },

  appleBtn: { backgroundColor: '#000' },
  appleText: { fontSize: 17, fontWeight: '600', color: '#fff' },

  googleBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },
  googleText: { fontSize: 17, fontWeight: '600', color: '#333' },

  footer: {
    marginTop: 30,
    fontSize: 14,
    color: '#6A6A6A',
    textAlign: 'center',
  },
  link: { textDecorationLine: 'underline' },
});

