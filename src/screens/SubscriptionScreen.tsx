import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  Check,
  ChevronRight,
  Wallet,
  MapPin,
  Star,
  Shield,
  Wrench,
  Phone,
  X,
  Tag,
} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { useWallet } from '../contexts/WalletContext';
import { useAddress } from '../contexts/AddressContext';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../navigation/routes/Routes';
import TouchableScale from '../components/TouchableScale';

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  color: string;
  benefits: string[];
  popular?: boolean;
}

interface Vehicle {
  id: string;
  name: string;
  image: any;
  basePrice: number;
}

const SubscriptionScreen = () => {
  const navigation = useNavigation<any>();
  const { balance } = useWallet();
  const [duration, setDuration] = useState(3);
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('activa');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const { addresses } = useAddress();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(def);
    }
  }, [addresses]);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 2999,
      color: '#9ca3af',
      benefits: ['100 km/day limit', 'Basic maintenance', 'Email support'],
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 3999,
      color: '#fbbf24',
      benefits: [
        'Unlimited km',
        'Free maintenance',
        '24/7 support',
        'Free doorstep delivery',
      ],
      popular: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      monthlyPrice: 5499,
      color: '#a855f7',
      benefits: [
        'Unlimited km',
        'Premium maintenance',
        'Priority support',
        'Free doorstep delivery',
        'Insurance included',
        'Free helmet & accessories',
      ],
    },
  ];

  const vehicles: Vehicle[] = [
    {
      id: 'activa',
      name: 'Honda Activa 6G',
      image: require('../../assets/images/icon.jpg'),
      basePrice: 0,
    },
    {
      id: 'jupiter',
      name: 'TVS Jupiter',
      image: require('../../assets/images/icon.jpg'),
      basePrice: 200,
    },
    {
      id: 'access',
      name: 'Suzuki Access 125',
      image: require('../../assets/images/icon.jpg'),
      basePrice: 300,
    },
  ];

  const calculatePrice = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!plan || !vehicle) return 0;

    const basePrice = plan.monthlyPrice + vehicle.basePrice;
    const discount = duration >= 6 ? 0.1 : duration >= 3 ? 0.05 : 0;
    const subtotal = basePrice * duration;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    return {
      subtotal: subtotal || 0,
      discountAmount: discountAmount || 0,
      total: total || 0,
      monthlyPrice: basePrice || 0
    };
  };

  const handleSubscribe = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select date and time.');
      return;
    }
    if (!selectedAddress) {
      Alert.alert('Missing Address', 'Please select a delivery address.');
      return;
    }

    const { total } = calculatePrice();
    Alert.alert(
      'Subscription Confirmation',
      `Total: ₹${total.toFixed(0)}\\n\\nProceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            Alert.alert('Success', 'Subscription activated successfully!');
          },
        },
      ]
    );
  };

  const pricing = calculatePrice();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Premium Header */}
      <View className="bg-white px-6 py-4 flex-row items-center justify-between border-b border-gray-50">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 bg-gray-50 p-2 rounded-full">
            <X size={20} color="black" />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-black text-gray-900 tracking-tight">Monthly Subscription</Text>
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">RBX Elite Plans</Text>
          </View>
        </View>
        <TouchableOpacity className="bg-yellow-50 p-2.5 rounded-2xl">
          <Phone size={18} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Vehicle Preview Card */}
        <View className="px-6 pt-6">
          <View className="bg-gray-50 rounded-[40px] p-6 items-center border border-gray-100/50">
            <Image
              source={vehicles.find(v => v.id === selectedVehicle)?.image}
              className="w-full h-44"
              resizeMode="contain"
            />
            <View className="bg-white/80 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm mt-4">
              <Text className="text-gray-900 font-black text-sm uppercase tracking-tighter">
                {vehicles.find(v => v.id === selectedVehicle)?.name}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-8">
          {/* Section: Plans */}
          <View className="flex-row justify-between items-end mb-6">
            <View>
              <Text className="text-2xl font-black text-gray-900 tracking-tighter">Elite Plans</Text>
              <Text className="text-gray-400 font-bold text-sm">Pick the perfect package</Text>
            </View>
            <Tag size={20} color="#94a3b8" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            {plans.map(plan => (
              <TouchableScale
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                className={`mr-4 w-44 rounded-[32px] p-5 border-2 ${selectedPlan === plan.id
                  ? 'border-yellow-400 bg-yellow-50/50'
                  : 'border-gray-100 bg-white'
                  }`}
                style={{
                  elevation: selectedPlan === plan.id ? 10 : 0,
                  shadowColor: '#facc15',
                  shadowOpacity: 0.1,
                  shadowRadius: 10
                }}
              >
                {plan.popular && (
                  <View className="absolute -top-3 left-6 bg-black px-3 py-1 rounded-full">
                    <Star size={10} color="white" fill="white" />
                  </View>
                )}
                <Text className="font-black text-gray-900 text-lg mb-1">{plan.name}</Text>
                <View className="flex-row items-baseline">
                  <Text className="text-2xl font-black text-gray-900">₹{plan.monthlyPrice}</Text>
                  <Text className="text-[10px] font-black text-gray-400 ml-1 uppercase">/mo</Text>
                </View>

                <View className="mt-4 pt-4 border-t border-gray-100/50">
                  {plan.benefits.slice(0, 2).map((b, i) => (
                    <View key={i} className="flex-row items-center mb-1.5">
                      <View className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2" />
                      <Text className="text-[10px] font-bold text-gray-600" numberOfLines={1}>{b}</Text>
                    </View>
                  ))}
                </View>
              </TouchableScale>
            ))}
          </ScrollView>

          {/* Section: Vehicle Scroll */}
          <View className="mb-8">
            <Text className="text-sm font-black text-gray-400 uppercase tracking-[3px] mb-4 ml-1">Swap Vehicle</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {vehicles.map(v => (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedVehicle(v.id)}
                  className={`mr-3 rounded-[24px] px-5 py-3 border-2 flex-row items-center ${selectedVehicle === v.id ? 'border-yellow-400 bg-yellow-400' : 'border-gray-50 bg-gray-50'}`}
                >
                  <Image source={v.image} className="w-10 h-8 mr-3" resizeMode="contain" />
                  <Text className={`font-black text-sm ${selectedVehicle === v.id ? 'text-black' : 'text-gray-400'}`}>{v.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section: Duration */}
          <View className="bg-gray-50 rounded-[32px] p-6 mb-8 border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-black text-black uppercase tracking-widest">Rental Tenure</Text>
              <View className="bg-black px-3 py-1 rounded-full">
                <Text className="text-white font-black text-[10px]">{duration} MONTHS</Text>
              </View>
            </View>

            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={12}
              step={1}
              value={duration}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#facc15"
              onValueChange={v => setDuration(v)}
            />

            <View className="flex-row justify-between mt-2 px-1">
              <Text className="text-[10px] font-black text-gray-400">1 MO</Text>
              <Text className="text-[10px] font-black text-gray-400">12 MO</Text>
            </View>

            {duration >= 3 && (
              <View className="absolute -top-3 right-6 bg-green-500 px-3 py-1 rounded-full">
                <Text className="text-white font-black text-[10px] tracking-tighter">
                  SAVING {duration >= 6 ? '10%' : '5%'} EXTRA
                </Text>
              </View>
            )}
          </View>

          {/* Section: Schedule & Address */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              onPress={() => setSelectedDate('2025-12-10')}
              className="flex-1 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm"
            >
              <Calendar size={18} color="#fbbf24" strokeWidth={3} />
              <Text className="text-[10px] font-black text-gray-400 uppercase mt-2">Delivery Date</Text>
              <Text className="text-sm font-black text-gray-900 mt-0.5">{selectedDate || 'Select'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTime('10:00 AM')}
              className="flex-1 bg-white border border-gray-100 rounded-3xl p-4 shadow-sm"
            >
              <Clock size={18} color="#fbbf24" strokeWidth={3} />
              <Text className="text-[10px] font-black text-gray-400 uppercase mt-2">Preferred Slot</Text>
              <Text className="text-sm font-black text-gray-900 mt-0.5">{selectedTime || 'Select'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddressModal(true)}
            className="bg-white border border-gray-100 rounded-[32px] p-5 mb-10 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <View className="bg-gray-50 p-3 rounded-2xl mr-4">
                <MapPin size={22} color="#000" strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Delivery at</Text>
                <Text className="font-black text-gray-900 text-base" numberOfLines={1}>
                  {selectedAddress?.label || 'Choose delivery location'}
                </Text>
                {selectedAddress && (
                  <Text className="text-[10px] font-bold text-gray-400" numberOfLines={1}>
                    {selectedAddress.line1}, {selectedAddress.city}
                  </Text>
                )}
              </View>
            </View>
            <ChevronRight size={20} color="#94a3b8" />
          </TouchableOpacity>

          {/* Checkout Summery */}
          <View className="bg-black rounded-[40px] p-8 mb-10 shadow-2xl shadow-black/30">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white/50 font-black text-xs uppercase tracking-[4px]">Investment Breakdown</Text>
              <Wallet size={20} color="#fff" />
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-base font-bold">Base Subscription</Text>
              <Text className="text-white text-lg font-black">₹{pricing.subtotal.toFixed(0)}</Text>
            </View>

            {pricing.discountAmount > 0 && (
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-green-400 text-base font-bold">Loyalty Discount</Text>
                <Text className="text-green-400 text-lg font-black">-₹{pricing.discountAmount.toFixed(0)}</Text>
              </View>
            )}

            <View className="pt-6 border-t border-white/10 mt-2 flex-row justify-between items-end">
              <View>
                <Text className="text-white/50 font-black text-[10px] uppercase mb-1">Total Payable</Text>
                <Text className="text-white text-3xl font-black">₹{pricing.total.toFixed(0)}</Text>
              </View>
              <TouchableScale
                onPress={handleSubscribe}
                className="bg-yellow-400 px-8 py-4 rounded-3xl"
              >
                <Text className="text-black font-black uppercase text-sm">Checkout</Text>
              </TouchableScale>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] p-8 max-h-[75%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-gray-900 uppercase tracking-tighter">Select Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)} className="bg-gray-50 p-2 rounded-full">
                <X size={18} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {addresses.map(address => (
                <TouchableOpacity
                  key={address._id}
                  onPress={() => {
                    setSelectedAddress(address);
                    setShowAddressModal(false);
                  }}
                  className={`p-5 rounded-3xl mb-3 border-2 ${selectedAddress?._id === address._id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-50 bg-gray-50'}`}
                >
                  <Text className="font-black text-gray-900 text-base mb-1">
                    {address.label}
                  </Text>
                  <Text className="text-xs font-bold text-gray-400 leading-4" numberOfLines={2}>
                    {address.line1}, {address.city}, {address.state} {address.pincode}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableScale
                onPress={() => {
                  setShowAddressModal(false);
                  navigation.navigate(ROUTES.ADD_EDIT_ADDRESS);
                }}
                className="bg-black p-5 rounded-3xl items-center mt-4"
              >
                <Text className="font-black text-white uppercase text-xs tracking-widest">Add New Address</Text>
              </TouchableScale>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({});
