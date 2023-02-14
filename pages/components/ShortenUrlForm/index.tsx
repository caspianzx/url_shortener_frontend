import React, { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Input as AntdInput, Modal, message, Button } from "antd";
import validator from 'validator';
import useSWRMutation from 'swr/mutation'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';


async function sendRequest(url: string, { arg } : any) {
  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(arg),
    })

    return res.json()
  } catch (err) {
    // display error or redirect to error page. will do this if there's time
    console.log(err)

  }
}

 const ShortenUrlForm = () => {

  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data:any) => {
    // alert(JSON.stringify(data));
    await trigger(data)
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shortenedUrl, setShortenUrl] = useState("")

   const { trigger, isMutating, error: requestError, data } = useSWRMutation(`${process.env.NEXT_PUBLIC_API}/api/shorten-url`, sendRequest, {
     onSuccess: (data, key, config) => {
       setShortenUrl(data.shortenedUrl)
       setIsModalOpen(true)
     }
   })

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // display link copy message
   const [messageApi, contextHolder] = message.useMessage();
   const notify = () => {
     messageApi.info('Link copied!');
   };

  return (
      <>
        {contextHolder}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Enter a long URL to make a short url</label>
          <Controller
              render={({ field }) => <AntdInput {...field} />}
              name="originalUrl"
              control={control}
              defaultValue=""
              rules={{ validate : value =>  validator.isURL(value, { protocols: ['https'], require_protocol: true}) || 'please enter a valid url' }}/>
          {errors.originalUrl && <p>Please enter a valid url</p>}
          <input type="submit" disabled={isMutating} />
        </form>
        {requestError && <p>{requestError.message}</p>}

        <Modal title="Your shortened url" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
          <div className={"shortened-url-box"}>{shortenedUrl}</div>
          <div className={"copy-link-section"}>
            <CopyToClipboard
                text={shortenedUrl}
                onCopy={() => notify()}
            >
              <Button className={"copy-link-button"}><CopyOutlined />Copy</Button>
            </CopyToClipboard>
          </div>
        </Modal>
      </>
  )
}

 export  default ShortenUrlForm