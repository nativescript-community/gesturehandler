#import "GestureHandlerManager.h"

#import "GestureHandlerState.h"
#import "GestureHandler.h"
#import "GestureHandlerRegistry.h"
#import "RootViewGestureRecognizer.h"

#import "PanHandler.h"
#import "TapHandler.h"
#import "FlingHandler.h"
#import "LongPressHandler.h"
#import "NativeViewHandler.h"
#import "PinchHandler.h"
#import "RotationHandler.h"
#import "ForceTouchHandler.h"


@interface GestureHandlerManager ()

@end

@implementation GestureHandlerManager
{
    GestureHandlerRegistry *_registry;
    NSMutableSet<UIView*> *_rootViews;
}

- (instancetype)init
{
    if ((self = [super init])) {
        _registry = [GestureHandlerRegistry new];
        _rootViews = [NSMutableSet new];
    }
    return self;
}

- (GestureHandler*)createGestureHandler:(NSString *)handlerName
                         tag:(NSNumber *)handlerTag
                      config:(NSDictionary *)config
{
    static NSDictionary *map;
    static dispatch_once_t mapToken;
    dispatch_once(&mapToken, ^{
        map = @{
                @"pan" : [PanGestureHandler class],
                @"tap" : [TapGestureHandler class],
                @"fling" : [FlingGestureHandler class],
                @"longPress": [LongPressGestureHandler class],
                @"nativeView": [NativeViewGestureHandler class],
                @"pinch": [PinchGestureHandler class],
                @"rotation": [RotationGestureHandler class],
                @"forceTouch": [ForceTouchHandler class],
                };
    });
    
    Class nodeClass = map[handlerName];
   if (!nodeClass) {
        NSLog(@"Gesture handler type %@ is not supported", handlerName);
        return nil;
    }
    
    GestureHandler *gestureHandler = [[nodeClass alloc] initWithTag:handlerTag];
    [gestureHandler configure:config];
    [_registry registerGestureHandler:gestureHandler];
    return gestureHandler;
//    __weak id<GestureHandlerEventEmitter> emitter = self;
//    gestureHandler.emitter = emitter;
}


- (void)attachGestureHandler:(nonnull NSNumber *)handlerTag
               toView:(nonnull UIView *)view
{
    [_registry attachHandlerWithTag:handlerTag toView:view];

    // register root view if not already there
//    [self registerRootViewIfNeeded:view];
}

- (void)updateGestureHandler:(NSNumber *)handlerTag config:(NSDictionary *)config
{
    GestureHandler *handler = [_registry handlerWithTag:handlerTag];
    [handler configure:config];
}

- (void)dropGestureHandler:(NSNumber *)handlerTag
{
    [_registry dropHandlerWithTag:handlerTag];
}

- (void)detachGestureHandler:(NSNumber *)handlerTag
{
    [_registry detachHandlerWithTag:handlerTag];
}
//- (void)handleSetJSResponder:(NSNumber *)viewTag blockNativeResponder:(NSNumber *)blockNativeResponder
//{
//    if ([blockNativeResponder boolValue]) {
//        for (RCTRootView *rootView in _rootViews) {
//            for (UIGestureRecognizer *recognizer in rootView.gestureRecognizers) {
//                if ([recognizer isKindOfClass:[RNRootViewGestureRecognizer class]]) {
//                    [(RNRootViewGestureRecognizer *)recognizer blockOtherRecognizers];
//                }
//            }
//        }
//    }
//}

//- (void)handleClearJSResponder
//{
//    // ignore...
//}

#pragma mark Root Views Management

//- (void)registerRootViewIfNeeded:(UIView*)childView
//{
//    UIView *parent = childView;
//    while (parent != nil && ![parent isKindOfClass:[RCTRootView class]]) parent = parent.superview;
//
//    RootView *rootView = (RCTRootView *)parent;
//    UIView *rootContentView = rootView.contentView;
//    if (rootContentView != nil && ![_rootViews containsObject:rootContentView]) {
//        LifecycleLog(@"[GESTURE HANDLER] Initialize gesture handler for root view %@", rootContentView);
//        [_rootViews addObject:rootContentView];
//        RootViewGestureRecognizer *recognizer = [RNRootViewGestureRecognizer new];
//        recognizer.delegate = self;
//        rootContentView.userInteractionEnabled = YES;
//        [rootContentView addGestureRecognizer:recognizer];
//    }
//}

- (void)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    didActivateInRootView:(UIView *)rootContentView
{
    // Cancel touches in RN's root view in order to cancel all in-js recognizers

    // As scroll events are special-cased in RN responder implementation and sending them would
    // trigger JS responder change, we don't cancel touches if the handler that got activated is
    // a scroll recognizer. This way root view will keep sending touchMove and touchEnd events
    // and therefore allow JS responder to properly release the responder at the end of the touch
    // stream.
    // NOTE: this is not a proper fix and solving this problem requires upstream fixes to RN. In
    // particular if we have one PanHandler and ScrollView that can work simultaniously then when
    // the Pan handler activates it would still tigger cancel events.
    // Once the upstream fix lands the line below along with this comment can be removed
    if ([gestureRecognizer.view isKindOfClass:[UIScrollView class]]) return;

//    UIView *parent = rootContentView.superview;
//    if ([parent isKindOfClass:[RCTRootView class]]) {
//        [(RCTRootView*)parent cancelTouches];
//    }
}

- (void)dealloc
{
//    if ([_rootViews count] > 0) {
//        LifecycleLog(@"[GESTURE HANDLER] Tearing down gesture handler registered for views %@", _rootViews);
//    }
}

//#pragma mark Events

//- (void)sendTouchEvent:(GestureHandlerEvent *)event
//{
////    [_eventDispatcher sendEvent:event];
//}
//
//- (void)sendStateChangeEvent:(GestureHandlerStateChange *)event
//{
////    [_eventDispatcher sendEvent:event];
//}

@end
