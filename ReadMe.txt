keystore.password=meterbook_123@!

buidl script 

// force release => gradlew app:assembleRelease

build Tool version resolved 
Dir=> Android/build.gradle
subprojects {
    afterEvaluate {project ->
        if (project.hasProperty("android")) {
            android {
                compileSdkVersion 30
                buildToolsVersion "30.0.2"
                }
            }    
        }
}

//excel file 
//permissions
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
//libs
react-native-fs
xlsx
react-native-document-picker

