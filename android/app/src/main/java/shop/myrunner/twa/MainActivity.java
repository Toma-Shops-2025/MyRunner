package shop.myrunner.twa;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import io.capawesome.capacitorjs.plugins.androidedgetoedgesupport.EdgeToEdgePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        EdgeToEdge.enable(this);
        registerPlugin(EdgeToEdgePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
