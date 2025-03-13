import { IPhoneCall, IPhoneMessage, PhoneCallStatus, PhoneMessageType } from '@revolt-rp/common';
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
        id: '546457457345',
        name: 'John Doe',
        phoneNumber: '321199',
        favorite: false
      },
      {
        id: '34253345443252525623',
        name: 'Muki Muki',
        phoneNumber: '3426534',
        favorite: false
      },
      {
        id: '436436356756',
        name: 'Diler droge 234',
        phoneNumber: '654543',
        favorite: true
      },
      {
        id: '3425324545245365623',
        name: 'moja zena <3',
        phoneNumber: '54656743',
        favorite: true
      },
      {
        id: '3425456546456325623',
        name: 'dwadwadwa awdwa',
        phoneNumber: '6547345',
        favorite: false
      },
      {
        id: '342535633453242325623',
        name: 'adwada awdad',
        phoneNumber: '435434',
        favorite: false
      },
      {
        id: '2342356465464',
        name: 'dawdwaa awdwa',
        phoneNumber: '654654',
        favorite: false
      },
      {
        id: '3425325623',
        name: 'adawdwadwa awdwa',
        phoneNumber: '5645654',
        favorite: false
      }
    ],
    backgroundImage: 'assets/images/phone/backgrounds/1.jpg'
  }
};


export const testPhoneCall: IPhoneCall = {
  caller: '321199',
  receiver: testPhoneData.phoneInfo!.phoneNumber,
  status: PhoneCallStatus.Ended,
  createdAt: dayjs().subtract(3, 'minutes').toDate(),
  _id: new Types.ObjectId('4BFD7ED40E74F7461702D4C2'),
  id: '4BFD7ED40E74F7461702D4C2'
}

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
