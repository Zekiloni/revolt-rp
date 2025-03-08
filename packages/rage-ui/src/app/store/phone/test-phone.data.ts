import { IPhoneMessage, PhoneMessageType } from '@revolt-rp/common';
import { Types } from 'mongoose';
import dayjs from 'dayjs';


export const testPhoneData: Partial<IPhoneItem> = {
  id: 'test-phone',
  phoneInfo: {
    power: true,
    opacity: 0.9,
    phoneNumber: '1234567890',
    notes: [],
    contacts: [
      {
        name: 'John Doe',
        phoneNumber: '321199',
        favorite: false
      }
    ],
    backgroundImage: 'assets/images/phone/backgrounds/1.jpg'
  }
};


export const testMessages: IPhoneMessage[] = [
  {
    type: PhoneMessageType.Text,
    sender: testPhoneData.phoneInfo!.phoneNumber,
    receiver: '321199',
    content: 'jel imas deset maraka',
    seen: true,
    createdAt: dayjs().subtract(2, 'hours').toDate(),
    _id: new Types.ObjectId('AA37142F9BE852C184924BC7'),
    id: 'AA37142F9BE852C184924BC7'
  },
  {
    type: PhoneMessageType.Text,
    sender: '321199',
    receiver: testPhoneData.phoneInfo!.phoneNumber,
    content: 'imam',
    seen: false,
    createdAt: dayjs().subtract(3, 'minutes').toDate(),
    _id: new Types.ObjectId('4BFD7ED40E74F7461702D4C2'),
    id: '4BFD7ED40E74F7461702D4C2'
  },
  {
    type: PhoneMessageType.Location,
    sender: '321199',
    receiver: testPhoneData.phoneInfo!.phoneNumber,
    content: '{"lat":43.8563,"lng":18.4131}',
    seen: false,
    createdAt: dayjs().subtract(2, 'minutes').toDate(),
    _id: new Types.ObjectId('4BFD7ED40E74F7461702D4C2'),
    id: '4BFD7ED40E74F7461702D4C2'
  },
  {
    type: PhoneMessageType.Text,
    sender: '321199',
    receiver: testPhoneData.phoneInfo!.phoneNumber,
    content: 'dodji kod ferhatovica',
    seen: false,
    createdAt: dayjs().subtract(1, 'minutes').toDate(),
    _id: new Types.ObjectId('4BFD7ED40E74F7461702D4C2'),
    id: '4BFD7ED40E74F7461702D4C2'
  },
];
