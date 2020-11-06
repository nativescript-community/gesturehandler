//
//  GestureHandler.h
//  GestureHandler
//
//  Created by Martin Guillon on 6/5/19.
//  Copyright © 2019 Stefan Dragnev. All rights reserved.
//

#import "GestureHandlerState.h"
#import "GestureHandlerDirection.h"
#import "GestureHandlerEvents.h"

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#define VEC_LEN_SQ(pt) (pt.x * pt.x + pt.y * pt.y)
#define TEST_MIN_IF_NOT_NAN(value, limit) \
(!isnan(limit) && ((limit < 0 && value <= limit) || (limit >= 0 && value >= limit)))

#define TEST_MAX_IF_NOT_NAN(value, max) \
(!isnan(max) && ((max < 0 && value < max) || (max >= 0 && value > max)))

#define APPLY_PROP(recognizer, config, type, prop, propName) do { \
id value = config[propName]; \
if (value != nil) recognizer.prop = [value type]; \
} while(0)

#define APPLY_FLOAT_PROP(prop) do { APPLY_PROP(recognizer, config, floatValue, prop, @#prop); } while(0)
#define APPLY_INT_PROP(prop) do { APPLY_PROP(recognizer, config, integerValue, prop, @#prop); } while(0)
#define APPLY_NAMED_INT_PROP(prop, propName) do { APPLY_PROP(recognizer, config, integerValue, prop, propName); } while(0)

//@protocol GestureHandlerEventEmitter
//
//- (void)sendTouchEvent:(nonnull GestureHandlerEvent *)event;
//
//- (void)sendStateChangeEvent:(nonnull GestureHandlerStateChange *)event;
//
//@end


@protocol RootViewGestureRecognizerDelegate <UIGestureRecognizerDelegate>

@required
- (BOOL)gestureRecognizer:(nullable UIGestureRecognizer *)gestureRecognizer
    didActivateInRootView:(nullable UIView *)rootView;

@end


@class GestureHandler;
@protocol GestureHandlerDelegate  <NSObject>

@optional
- (BOOL)gestureHandler:(nullable GestureHandler *)gestureHandler shouldActivateForEvent:(nullable NSDictionary *)data;

@required
- (void)gestureHandler:(nullable GestureHandler *)gestureHandler
 didChangeState:(GestureHandlerState)state prevState:(GestureHandlerState)state extraData:(nullable NSDictionary *)data view:(nullable UIView *)view;

 @required
- (void)gestureHandler:(nullable GestureHandler *)gestureHandler
 touchEventOnView:(nullable UIView *)view state:(GestureHandlerState)state extraData:(nullable NSDictionary *)data;

@end

@interface GestureHandler : NSObject <UIGestureRecognizerDelegate> {
  
@protected UIGestureRecognizer *_recognizer;
@protected GestureHandlerState _lastState;
  
}

+ (nullable GestureHandler *)findGestureHandlerByRecognizer:(nonnull UIGestureRecognizer *)recognizer;

- (nonnull instancetype)initWithTag:(nonnull NSNumber *)tag;

@property (nonatomic, readonly, nonnull) NSNumber *tag;
//@property (nonatomic, weak, nullable) id<GestureHandlerEventEmitter> emitter;
@property (nonatomic, readonly, nullable) UIGestureRecognizer *recognizer;
@property (nonatomic) BOOL enabled;
@property(nonatomic) BOOL shouldCancelWhenOutside;
@property (nullable, nonatomic, weak) id<GestureHandlerDelegate> delegate;

- (void)bindToView:(nonnull UIView *)view;
- (void)unbindFromView;
- (void)configure:(nullable NSDictionary *)config NS_REQUIRES_SUPER;
- (void)handleGesture:(nonnull id)recognizer;
- (BOOL)containsPointInView;
- (GestureHandlerState)state;
- (nullable NSMutableDictionary *)eventExtraData:(nonnull id)recognizer;

- (void)reset;
- (void)sendEventsInState:(GestureHandlerState)state
           forView:(nonnull UIView *)view
            withExtraData:(nullable NSDictionary*)extraData;

@end

