//
// import { Constants } from '../../../../src/base/constants';
// import { useEffect, useRef, useState } from 'react';
// import { configureEvent, emitEvent } from '../../services/util';
// import YouTube from 'react-youtube';
//
// const TVPage = () => {
//   const [volume, setVolume] = useState(100);
//   const [url, setUrl] = useState('');
//   const player = useRef(null);
//
//   useEffect(() => {
//     configureEvent(Constants.TV_PAGE_TURN_ON, (url: string, volume: number) => {
//       setVolume(volume);
//       setUrl(url);
//     });
//
//     configureEvent(Constants.TV_PAGE_SET_VOLUME, (volume: number) => {
//       player.current.internalPlayer.setVolume(volume);
//     });
//
//     emitEvent(Constants.TV_PAGE_TURN_ON);
//   }, []);
//
//   const opts = {
//     height: window.screen.availHeight,
//     width: window.screen.availWidth,
//     playerVars: {
//       autoplay: 1,
//       controls: 0,
//       showinfo: 0,
//       disablekb: 1,
//       modestbranding: 1,
//       rel: 0,
//       enablejsapi: 1,
//     },
//   };
//
//   return url && <YouTube ref={player} videoId={url} opts={opts} onReady={(e) => e.target.setVolume(volume)} />
// };
//
// export default TVPage;
//
// import { useEffect, useState } from 'react';
// import { Constants } from '../../../../src/base/constants';
// import { Button, Flex, Form, Input, Modal, Slider } from 'antd';
// import { t } from 'i18next';
// import { configureEvent, emitEvent } from '../../services/util';
//
// const TVConfigPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [url, setUrl] = useState('');
//   const [volume, setVolume] = useState(100);
//
//   useEffect(() => {
//     configureEvent(Constants.TV_CONFIG_PAGE_SHOW, (url: string, volume: number) => {
//       setUrl(url);
//       setVolume(volume);
//       setLoading(false);
//     });
//
//     configureEvent(Constants.WEB_VIEW_END_LOADING, () => {
//       setLoading(false);
//     });
//
//     emitEvent(Constants.TV_CONFIG_PAGE_SHOW);
//   }, []);
//
//   const handleCancel = () => {
//     emitEvent(Constants.TV_CONFIG_PAGE_CLOSE);
//   };
//
//   const handleOk = () => {
//     setLoading(true);
//     emitEvent(Constants.TV_CONFIG_PAGE_SAVE, url, volume);
//   };
//
//   return <Modal open={true} title={t('tv')} onCancel={handleCancel} footer={null}>
//   <Form layout='vertical'>
//   <Form.Item label={t('videoId')}>
//   <Input value={url}
//   onChange={(e) => setUrl(e.target.value)}
//   />
//   </Form.Item>
//   <Form.Item label={t('volume')}>
//   <Slider value={volume} min={0} max={100} step={1}
//   onChange={(value: number) => setVolume(value)}
//   />
//   </Form.Item>
//   <Form.Item>
//   <Flex justify='space-evenly'>
//   <Button type='primary' onClick={handleOk} loading={loading}>{t('save')}</Button>
//   </Flex>
//   </Form.Item>
//   </Form>
//   </Modal>;
// };
//
// export default TVConfigPage;

// https://github.com/damagta/ragemp-roleplay-server/blob/4f4a402028d4c0e39dd6ec4da81a6d24c3a45c9d/src/TrevizaniRoleplay.Server/Scripts/PropertyScript.cs#L820
