import *as React from 'react'
import { Button, View, Platform, Alert } from 'react-native'
import *as ImagePicker from 'expo-image-picker'
import *as Permission from 'expo-permissions'

export default class PickImage extends React.Component{
    state = { image: null }
    
    render() {
        let { image } = this.state
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an Image from Camera Roll" onPress={this.pickimage}/>
            </View>
        )
    }
    uploadImage = async (uri) => {
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append("digit", fileToUpload)
        fetch("", {
            method: "POST",
            body: data,
            headers: { "content-type": "multipart/form-data" }
        })
            .then((response) => response.json())
            .then((result) => { console.log("Success ", result) })
            .catch((error) => { console.log("error ", error) })
    }

    componentDidMount() {
        this.getPermissionsAsync()
    }

    getPermissionsAsync = async() => {
        if (Platform.OS !== "web") {
            const { status = await Permissions.askAsync(Permissions.CAMERA_ROLL) }
            if (status !== "granted") {
                Alert("Sorry!, we need CAMERA ROLL PERMISSION to make this work.")
            }
        }
    }
    pickimage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                qualtiy: 1
            })

            if (!result.cancelled) {
                this.setState({ image: result.data })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        } catch (e) {
            console.log(e)
        }
    }
}
