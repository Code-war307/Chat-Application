export const dummyMsg = (text, mediaFiles, authUser, conversationId) => {
    const dummyMessage = {
      _id: `temp-${Date.now()}`,
      text: text,
      files: mediaFiles.map((data) => ({
        type: data.file?.type,
        previewUrl: data?.previewUrl,
        name: data.file?.name,
      })),
      senderId: {
        profilePic: authUser?.profilePic,
        username: authUser?.username,
        _id: authUser?._id,
      },
      receiverId: conversationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSending: false,
    };
    return dummyMessage;
}