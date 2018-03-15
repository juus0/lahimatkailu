import {StyleSheet, Dimensions} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        elevation: 5,
        marginTop: -100,
        marginBottom: 0,
        height: 140
    },
    name: {
        fontSize: 20,
        marginTop: 10,
        marginLeft: 25,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 10,
        marginLeft: 25,
        color: 'green'
    },
    description: {
        marginTop: 15,
        marginLeft: 25,
        marginRight: 30,
        marginBottom: 20
    },
    title: {
        fontSize: 16,
        width: '100%',
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        marginLeft: 10
    },
    openingTitle: {
        marginLeft: 25
    },
    opening: {
        minHeight: (Dimensions.get('window').height / 2) - 100,
        marginLeft: 25,
        marginBottom: 10
    },
    icons: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#74A335',
        height: 60,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 30,
        paddingRight: 30,
        width: '100%',
        elevation: 3
    },
    iconwrapper: {
        width: 57
    },
    icon: {
        fontSize: 21,
        color: '#EAF1DB',
        textAlign: 'center',
        elevation: 7
    },
    icontext: {
        color: '#EAF1DB',
        fontSize: 10,
        textAlign: 'center'
    },
    textarea: {
        backgroundColor: '#fff'
    },  topBar: {
        backgroundColor: '#74A335',
        height: 30,
        zIndex: 1000
    },
    topBarText: {
        position: 'absolute',
        top: 5,
        fontWeight: 'bold',
        left: '38%',
        fontSize: 14,
        color: 'white'
    },
    backIcon: {
        marginLeft: 5,
        marginTop: 3
    },
    openmap: {
        position: 'absolute',
        top: 5,
        right: 10
    },
});