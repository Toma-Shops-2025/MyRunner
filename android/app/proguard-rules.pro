# Capacitor plugins and JS bridge
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.annotation.Permission <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}

-keep public class * extends com.getcapacitor.Plugin { *; }

-keep @com.getcapacitor.NativePlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
}

-keep public class * extends org.apache.cordova.* {
    public <methods>;
    public <fields>;
}

# Google Play Billing
-keep class com.android.vending.billing.** { *; }
-keep class com.android.billingclient.** { *; }

-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
